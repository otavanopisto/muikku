package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.openfire.rest.client.entity.UserEntity;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

@Stateless
public class ChatSyncController {
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;

  @Inject
  private CourseMetaController courseMetaController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private UserController userController;

  @Inject
  private ChatController chatController;

  @Inject
  private Event<WorkspaceChatSettingsEnabledEvent> workspaceChatSettingsEnabledEvent;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  public void syncStudent(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.SEVERE, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.SEVERE, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.SEVERE, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.SEVERE, "Invalid openfire port, skipping room sync");
      return;
    }

    String openfireUserIdentifier = getOpenfireUserIdentifier(muikkuUserEntity);

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    SchoolDataIdentifier muikkuUserIdentifier = muikkuUserEntity.defaultSchoolDataIdentifier();
    SecureRandom random = new SecureRandom();
    User user = userController.findUserByIdentifier(muikkuUserIdentifier);
    if (user == null) {
      logger.log(Level.SEVERE, String.format("Muikku user %d not found", muikkuUserEntity.getId()));
      return;
    }

    try {
      // Checking before creating is subject to a race condition, but in the worst
      // case the creation just fails, resulting in a log entry
      UserEntity openfireUserEntity = client.getUser(openfireUserIdentifier);
      if (openfireUserEntity == null) {
        logger.log(Level.INFO, String.format("Adding chat user %s", openfireUserIdentifier));
        // Can't leave the password empty, so next best thing is random passwords

        // The passwords are not actually used
        byte[] passwordBytes = new byte[20];
        random.nextBytes(passwordBytes);
        String password = Base64.encodeBase64String(passwordBytes);

        openfireUserEntity = new UserEntity(openfireUserIdentifier, user.getDisplayName(), "", password);
        client.createUser(openfireUserEntity);
      }

      List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(muikkuUserEntity);

      for (WorkspaceEntity workspaceEntity : workspaceEntities) {

        // Ignore workspaces that don't have chat enabled
        WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
        if (workspaceChatSettings == null || workspaceChatSettings.getStatus() == WorkspaceChatStatus.DISABLED) {
          continue;
        }

        MUCRoomEntity chatRoomEntity = client.getChatRoom(workspaceEntity.getIdentifier());
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        Set<SchoolDataIdentifier> curriculumIdentifiers = workspace.getCurriculumIdentifiers();
        boolean hasCorrectCurriculums = true;

        for (SchoolDataIdentifier curriculumIdentifier : curriculumIdentifiers) {
          Curriculum curriculum = courseMetaController.findCurriculum(curriculumIdentifier);
          String curriculumName = curriculum.getName();
          if (curriculumName.equals("OPS2005")) {
            hasCorrectCurriculums = false;
            break;
          }
        }

        if (hasCorrectCurriculums) {

          if (chatRoomEntity == null) {
            logger.log(Level.INFO, "Syncing chat workspace " + workspaceEntity.getUrlName());

            String subjectCode = courseMetaController
                .findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();

            StringBuilder roomName = new StringBuilder();
            if (!StringUtils.isBlank(subjectCode)) {
              roomName.append(subjectCode);
            }
            if (workspace.getCourseNumber() != null) {
              roomName.append(workspace.getCourseNumber());
            }
            if (!StringUtils.isBlank(roomName)) {
              roomName.append(" - ");
            }
            // Prefer just name extension but fall back to workspace name if extension is not available
            if (!StringUtils.isBlank(workspace.getNameExtension())) {
              roomName.append(workspace.getNameExtension());
            }
            else {
              roomName.append(workspace.getName());
            }

            List<String> broadcastPresenceRolesList = new ArrayList<String>();
            broadcastPresenceRolesList.add("moderator");
            broadcastPresenceRolesList.add("participant");
            broadcastPresenceRolesList.add("visitor");

            chatRoomEntity = new MUCRoomEntity("workspace-chat-" + workspace.getIdentifier(), roomName.toString(), "");
            chatRoomEntity.setPersistent(true);
            chatRoomEntity.setLogEnabled(true);
            chatRoomEntity.setBroadcastPresenceRoles(broadcastPresenceRolesList);
            client.createChatRoom(chatRoomEntity);
          }

          EnvironmentRoleEntity role = userSchoolDataIdentifierController
              .findUserSchoolDataIdentifierRole(muikkuUserIdentifier);
          if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(role.getArchetype())
              || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(role.getArchetype())) {
            client.addOwner("workspace-chat-" + workspace.getIdentifier(), openfireUserIdentifier);
          }
          else {
            client.addMember("workspace-chat-" + workspace.getIdentifier(), openfireUserIdentifier);
          }
        }
      }
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, String.format("Exception syncing user %d", muikkuUserEntity.getId()), e);
    }
  }

  public void syncRoomOwners(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity, String roomName) {
    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.SEVERE, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.SEVERE, "No openfire url set, skipping room sync");
      return;
    }
    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.SEVERE, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.SEVERE, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    client.addOwner(roomName, getOpenfireUserIdentifier(muikkuUserEntity));
  }

  public void removeChatRoomMembership(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity,
      WorkspaceEntity workspaceEntity) {

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.SEVERE, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.SEVERE, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.SEVERE, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.SEVERE, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
    String roomName = workspace.getIdentifier();
    client.deleteMember(roomName, getOpenfireUserIdentifier(muikkuUserEntity));
  }

  public void removeWorkspaceChatRoom(WorkspaceEntity workspaceEntity) {

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    client.deleteChatRoom("workspace-chat-" + workspaceEntity.getIdentifier());

  }

  public void syncWorkspace(WorkspaceEntity workspaceEntity) {

    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping room sync");
      return;
    }

    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping room sync");
      return;
    }

    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping room sync");
      return;
    }

    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    String subjectCode = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();

    String separator = "workspace-chat-";
    StringBuilder roomName = new StringBuilder();
    if (!StringUtils.isBlank(subjectCode)) {
      roomName.append(subjectCode);
    }
    if (workspace.getCourseNumber() != null) {
      roomName.append(workspace.getCourseNumber());
    }
    if (!StringUtils.isBlank(roomName)) {
      roomName.append(" - ");
    }
    // Prefer just name extension but fall back to workspace name if extension is not available
    if (!StringUtils.isBlank(workspace.getNameExtension())) {
      roomName.append(workspace.getNameExtension());
    }
    else {
      roomName.append(workspace.getName());
    }
    MUCRoomEntity chatRoomEntity = client.getChatRoom(workspace.getIdentifier());

    List<String> broadcastPresenceRolesList = new ArrayList<String>();
    broadcastPresenceRolesList.add("moderator");
    broadcastPresenceRolesList.add("participant");
    broadcastPresenceRolesList.add("visitor");

    chatRoomEntity = new MUCRoomEntity(separator + workspace.getIdentifier(), roomName.toString(), "");
    chatRoomEntity.setPersistent(true);
    chatRoomEntity.setLogEnabled(true);
    chatRoomEntity.setBroadcastPresenceRoles(broadcastPresenceRolesList);
    client.createChatRoom(chatRoomEntity);

    workspaceChatSettingsEnabledEvent.fire(new WorkspaceChatSettingsEnabledEvent(workspace.getSchoolDataSource(), workspace.getIdentifier(), true));
  }

  public void syncWorkspaceUser(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.INFO, "No openfire token set, skipping room sync");
      return;
    }
    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.INFO, "No openfire url set, skipping room sync");
      return;
    }
    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.INFO, "No openfire port set, skipping room sync");
      return;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "Invalid openfire port, skipping room sync");
      return;
    }
    AuthenticationToken token = new AuthenticationToken(openfireToken);
    RestApiClient client = new RestApiClient(openfireUrl, Integer.parseInt(openfirePort, 10), token);

    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(muikkuUserEntity.defaultSchoolDataIdentifier());
    if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(role.getArchetype()) || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(role.getArchetype())) {
      client.addOwner("workspace-chat-" + workspace.getIdentifier(), getOpenfireUserIdentifier(muikkuUserEntity));
    }
    else {
      client.addMember("workspace-chat-" + workspace.getIdentifier(), getOpenfireUserIdentifier(muikkuUserEntity));
    }
  }
  
  private String getOpenfireUserIdentifier(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    return String.format("muikku-user-%d", muikkuUserEntity.getId());
  }

}
