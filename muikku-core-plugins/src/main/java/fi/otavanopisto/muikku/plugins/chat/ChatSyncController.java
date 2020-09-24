package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
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
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.openfire.rest.client.entity.UserEntity;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatVisibility;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatSettings;
import fi.otavanopisto.muikku.plugins.chat.model.WorkspaceChatStatus;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
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
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  /**
   * Make sure the given user has an account on Openfire and is a member of all workspace
   * chat rooms that they belong to
   * 
   * @param muikkuUserEntity The user entity
   */
  public void syncUser(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      try {
        // Make sure the user exists in Openfire
        
        UserEntity userEntity = ensureUserExists(client, muikkuUserEntity);
        if (userEntity != null) {

          // If the user is admin or study programme leader, simply add them as owners of every room...

          SchoolDataIdentifier muikkuUserIdentifier = muikkuUserEntity.defaultSchoolDataIdentifier();
          EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(muikkuUserIdentifier);
          if (role.getArchetype() == EnvironmentRoleArchetype.ADMINISTRATOR || role.getArchetype() == EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER) {
            List<MUCRoomEntity> rooms = client.getChatRooms().getMucRooms();
            for (MUCRoomEntity room : rooms) {
              ensureUserHasOwnership(client, room, muikkuUserEntity);
            }
          }
          else {
            
            // ...otherwise go through the workspaces of the user
            
            List<WorkspaceEntity> workspaceEntities = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserEntity(muikkuUserEntity);
            for (WorkspaceEntity workspaceEntity : workspaceEntities) {
              // Ignore workspaces that don't have chat enabled
              WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(workspaceEntity);
              if (workspaceChatSettings == null || workspaceChatSettings.getStatus() == WorkspaceChatStatus.DISABLED) {
                continue;
              }
              // Make sure the chat room exists in Openfire
              MUCRoomEntity chatRoomEntity = ensureRoomExists(client, workspaceEntity);
              if (chatRoomEntity != null) {
                // Make sure the user is a member (or owner) in the room
                ensureUserHasMembership(client, workspaceEntity, muikkuUserEntity);
              }
            }
          }
        }
      }
      catch (Exception e) {
        logger.log(Level.WARNING, String.format("Syncing student %d failed", muikkuUserEntity.getId()), e);
      }
    }
  }

  public void removeChatRoomMembership(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity, WorkspaceEntity workspaceEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      String roomName = workspace.getIdentifier();
      client.deleteMember(roomName, getOpenfireUserIdentifier(muikkuUserEntity));
    }
  }

  public void removeWorkspaceChatRoom(WorkspaceEntity workspaceEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      client.deleteChatRoom("workspace-chat-" + workspaceEntity.getIdentifier());
    }
  }

  /**
   * Make sure the given workspace has a chat room and that all members (with chat enabled)
   * are part of the room
   * 
   * @param workspaceEntity The workspace entity
   */
  public void syncWorkspace(WorkspaceEntity workspaceEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      MUCRoomEntity mucRoomEntity = ensureRoomExists(client, workspaceEntity);
      if (mucRoomEntity != null) {
        List<WorkspaceUserEntity> activeWorkspaceStudents = workspaceUserEntityController.listActiveWorkspaceStudents(workspaceEntity);
        List<WorkspaceUserEntity> workspaceStaffMembers = workspaceUserEntityController.listActiveWorkspaceStaffMembers(workspaceEntity);
        for (WorkspaceUserEntity activeWorkspaceStudent : activeWorkspaceStudents) {
          fi.otavanopisto.muikku.model.users.UserEntity userEntity = activeWorkspaceStudent.getUserSchoolDataIdentifier().getUserEntity();
          UserChatSettings userChatSetting = chatController.findUserChatSettings(userEntity);
          if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
            ensureUserHasMembership(client, workspaceEntity, userEntity);
          }
        }
        for (WorkspaceUserEntity workspaceStaffMember : workspaceStaffMembers) {
          fi.otavanopisto.muikku.model.users.UserEntity userEntity = workspaceStaffMember.getUserSchoolDataIdentifier().getUserEntity();
          UserChatSettings userChatSetting = chatController.findUserChatSettings(userEntity);
          if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
            ensureUserHasMembership(client, workspaceEntity, userEntity);
          }
        }
      }
      //workspaceChatSettingsEnabledEvent.fire(new WorkspaceChatSettingsEnabledEvent(workspace.getSchoolDataSource(), workspace.getIdentifier(), true));
    }
  }

  public void syncWorkspaceUser(WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
  
      EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(muikkuUserEntity.defaultSchoolDataIdentifier());
      if (role.getArchetype() == EnvironmentRoleArchetype.STUDENT) {
        client.addMember("workspace-chat-" + workspace.getIdentifier(), getOpenfireUserIdentifier(muikkuUserEntity));
      }
      else {
        client.addOwner("workspace-chat-" + workspace.getIdentifier(), getOpenfireUserIdentifier(muikkuUserEntity));
      }
    }
  }
  
  private MUCRoomEntity ensureRoomExists(RestApiClient client, WorkspaceEntity workspaceEntity) {
    MUCRoomEntity chatRoomEntity = null;
    chatRoomEntity = client.getChatRoom(workspaceEntity.getIdentifier());
    if (chatRoomEntity == null) {
      logger.log(Level.INFO, String.format("Creating workspace chat room %d", workspaceEntity.getId()));
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      String subjectCode = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();
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
    return chatRoomEntity;
  }
  
  private UserEntity ensureUserExists(RestApiClient client, fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    UserEntity openfireUserEntity = null;
    SchoolDataIdentifier muikkuUserIdentifier = muikkuUserEntity.defaultSchoolDataIdentifier();
    User user = userController.findUserByIdentifier(muikkuUserIdentifier);
    if (user == null) {
      logger.log(Level.SEVERE, String.format("Muikku user %d not found", muikkuUserEntity.getId()));
      return null;
    }
    String openfireUserIdentifier = getOpenfireUserIdentifier(muikkuUserEntity);
    openfireUserEntity = client.getUser(openfireUserIdentifier);
    if (openfireUserEntity == null) {
      logger.log(Level.INFO, String.format("Creating chat user %s", openfireUserIdentifier));
      SecureRandom random = new SecureRandom();
      // Can't leave the password empty, so next best thing is random passwords (not used with prebind)
      byte[] passwordBytes = new byte[20];
      random.nextBytes(passwordBytes);
      String password = Base64.encodeBase64String(passwordBytes);
      openfireUserEntity = new UserEntity(openfireUserIdentifier, user.getDisplayName(), "", password);
      client.createUser(openfireUserEntity);
    }
    return openfireUserEntity;
  }
  
  private void ensureUserHasMembership(RestApiClient client, WorkspaceEntity workspaceEntity, fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    String openfireUserIdentifier = getOpenfireUserIdentifier(muikkuUserEntity);
    SchoolDataIdentifier muikkuUserIdentifier = muikkuUserEntity.defaultSchoolDataIdentifier();
    EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(muikkuUserIdentifier);
    if (role.getArchetype() == EnvironmentRoleArchetype.STUDENT) {
      client.addMember("workspace-chat-" + workspaceEntity.getIdentifier(), openfireUserIdentifier);
    }
    else {
      client.addOwner("workspace-chat-" + workspaceEntity.getIdentifier(), openfireUserIdentifier);
    }
  }
  
  private void ensureUserHasOwnership(RestApiClient client, MUCRoomEntity mucRoomEntity, fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    String openfireUserIdentifier = getOpenfireUserIdentifier(muikkuUserEntity);
    client.addOwner(mucRoomEntity.getRoomName(), openfireUserIdentifier);
  }
  
  private RestApiClient getClient() {
    String openfireToken = pluginSettingsController.getPluginSetting("chat", "openfireToken");
    if (openfireToken == null) {
      logger.log(Level.SEVERE, "chat.openfireToken not set");
      return null;
    }
    String openfireUrl = pluginSettingsController.getPluginSetting("chat", "openfireUrl");
    if (openfireUrl == null) {
      logger.log(Level.SEVERE, "chat.openfireUrl not set");
      return null;
    }
    String openfirePort = pluginSettingsController.getPluginSetting("chat", "openfirePort");
    if (openfirePort == null) {
      logger.log(Level.SEVERE, "chat.openfirePort not set");
      return null;
    }
    if (!StringUtils.isNumeric(openfirePort)) {
      logger.log(Level.WARNING, "chat.openfirePort is not a number");
      return null;
    }
    AuthenticationToken token = new AuthenticationToken(openfireToken);
    return new RestApiClient(openfireUrl, Integer.valueOf(openfirePort), token);
  }
  
  private String getOpenfireUserIdentifier(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity) {
    return String.format("muikku-user-%d", muikkuUserEntity.getId());
  }

}
