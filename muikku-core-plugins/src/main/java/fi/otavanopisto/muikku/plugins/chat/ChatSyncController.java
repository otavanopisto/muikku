package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
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
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceSubject;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.users.OrganizationEntityController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class ChatSyncController {

  @Inject
  private OrganizationEntityController organizationEntityController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private UserEntityController userEntityController;

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
            Map<String, String> params = new HashMap<>();
            params.put("type", "all");
            List<MUCRoomEntity> rooms = client.getChatRooms(params).getMucRooms();
            if (rooms != null) {
              for (MUCRoomEntity room : rooms) {
                ensureUserHasOwnership(client, room, muikkuUserEntity);
              }
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
  
  public String createPublicChatRoom(String title, String description, fi.otavanopisto.muikku.model.users.UserEntity owner) {
    String name = null;
    RestApiClient client = getClient();
    if (client != null) {
      // Do our best to turn the given title into a room name that is valid and available
      String proposedName = generateName(title);
      if (StringUtils.startsWith(proposedName, "workspace-chat")) {
        logger.severe("Trying to create a public chat room that looks like a workspace chat room");
        return null;
      }
      MUCRoomEntity mucRoomEntity = client.getChatRoom(proposedName);
      if (mucRoomEntity != null) {
        for (int i = 2; i <= 6; i++) {
          mucRoomEntity = client.getChatRoom(String.format("%s-%d", proposedName, i));
          if (mucRoomEntity == null) {
            proposedName = String.format("%s-%d", proposedName, i);
            break;
          }
        }
      }
      if (mucRoomEntity != null) {
        logger.severe(String.format("Failed to create a unique room name with title %s", title));
        return null;
      }
      
      // Room data
      
      mucRoomEntity = new MUCRoomEntity(proposedName, title, description);
      mucRoomEntity.setPublicRoom(true);
      mucRoomEntity.setPersistent(true);
      mucRoomEntity.setLogEnabled(true);
      mucRoomEntity.setCanChangeNickname(true);
      mucRoomEntity.setCanAnyoneDiscoverJID(true);
      List<String> broadcastPresenceRoles = new ArrayList<String>();
      broadcastPresenceRoles.add("moderator");
      broadcastPresenceRoles.add("participant");
      broadcastPresenceRoles.add("visitor");
      mucRoomEntity.setBroadcastPresenceRoles(broadcastPresenceRoles);
      
      // Creation
      
      Response response = client.createChatRoom(mucRoomEntity);
      if (response.getStatus() != Status.CREATED.getStatusCode()) {
        logger.severe(String.format("Creating chat room with name %s Failed with HTTP error %d", proposedName, response.getStatus()));
        return null;
      }
        
      // Room created, add caller + all admins and study programme leaders as its owners
      ensureUserHasOwnership(client, mucRoomEntity, owner);
      addAdminsAsRoomOwners(client, mucRoomEntity, organizationEntityController.listLoggedUserOrganizations());
      return proposedName;
    }
    return name;
  }
  
  public void updatePublicChatRoom(String name, String title, String description) {
    RestApiClient client = getClient();
    if (client != null) {
      MUCRoomEntity mucRoomEntity = client.getChatRoom(name);
      if (mucRoomEntity != null) {
        mucRoomEntity.setNaturalName(title);
        mucRoomEntity.setDescription(description);
        client.updateChatRoom(mucRoomEntity);
      }
    }
  }

  public void removePublicChatRoom(String name) {
    RestApiClient client = getClient();
    if (client != null) {
      client.deleteChatRoom(name);
    }
  }

  public void removeWorkspaceChatRoom(String identifier) {
    RestApiClient client = getClient();
    if (client != null) {
      client.deleteChatRoom("workspace-chat-" + identifier);
    }
  }

  public void removeChatRoomMembership(fi.otavanopisto.muikku.model.users.UserEntity muikkuUserEntity, WorkspaceEntity workspaceEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      String roomName = "workspace-chat-" + workspace.getIdentifier();
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
            ensureUserHasOwnership(client, mucRoomEntity, userEntity);
          }
        }
        addAdminsAsRoomOwners(client, mucRoomEntity, Arrays.asList(workspaceEntity.getOrganizationEntity()));
      }
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
  
  public void ensureRoomNameUpToDate(WorkspaceEntity workspaceEntity) {
    RestApiClient client = getClient();
    if (client != null) {
      MUCRoomEntity mucRoomEntity = client.getChatRoom(String.format("workspace-chat-%s", workspaceEntity.getIdentifier()));
      if (mucRoomEntity != null) {
        Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
        String roomName = getRoomName(workspace);
        if (!StringUtils.equals(mucRoomEntity.getNaturalName(), roomName)) {
          mucRoomEntity.setNaturalName(roomName);
          client.updateChatRoom(mucRoomEntity);
        }
      }
    }
  }
  
  private MUCRoomEntity ensureRoomExists(RestApiClient client, WorkspaceEntity workspaceEntity) {
    MUCRoomEntity mucRoomEntity = null;
    mucRoomEntity = client.getChatRoom(String.format("workspace-chat-%s", workspaceEntity.getIdentifier()));
    if (mucRoomEntity == null) {
      logger.log(Level.INFO, String.format("Creating workspace chat room %d", workspaceEntity.getId()));
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      String roomName = getRoomName(workspace);
      mucRoomEntity = new MUCRoomEntity(String.format("workspace-chat-%s", workspace.getIdentifier()), roomName, "");
      mucRoomEntity.setPersistent(true);
      mucRoomEntity.setLogEnabled(true);
      mucRoomEntity.setCanChangeNickname(true);
      mucRoomEntity.setMembersOnly(true);
      mucRoomEntity.setCanAnyoneDiscoverJID(true);
      List<String> broadcastPresenceRoles = new ArrayList<String>();
      broadcastPresenceRoles.add("moderator");
      broadcastPresenceRoles.add("participant");
      broadcastPresenceRoles.add("visitor");
      mucRoomEntity.setBroadcastPresenceRoles(broadcastPresenceRoles);
      client.createChatRoom(mucRoomEntity);
    }
    return mucRoomEntity;
  }

  private String getRoomName(Workspace workspace) {
    if (workspace.getSubjects() != null && workspace.getSubjects().size() > 1) {
      /**
       *  Workspaces that have multiple subjects use naming convention of
       *  
       *  When nameExtension exists:
       *  workspace.name - workspace.nameExtension
       *  
       *  Otherwise:
       *  workspace.name
       */
      
      StringBuilder roomName = new StringBuilder();
      roomName.append(workspace.getName());
      if (!StringUtils.isBlank(workspace.getNameExtension())) {
        roomName.append(" - ");
        roomName.append(workspace.getNameExtension());
      }

      return roomName.toString();
    } else {
      /**
       * Workspaces that have only one subject
       * 
       * When nameExtension exists:
       * subjectCode + courseNumber - nameExtension
       * 
       * Otherwise:
       * subjectCode + courseNumber - name
       */
      
      WorkspaceSubject workspaceSubject = workspace.getSubjects() != null ? workspace.getSubjects().get(0) : null;
      String subjectCode = workspaceSubject != null ? courseMetaController.findSubject(workspaceSubject.getSubjectIdentifier()).getCode() : null;
      StringBuilder roomName = new StringBuilder();
      if (!StringUtils.isBlank(subjectCode)) {
        roomName.append(subjectCode);
      }
      if ((workspaceSubject != null) && (workspaceSubject.getCourseNumber() != null)) {
        roomName.append(workspaceSubject.getCourseNumber());
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
      return roomName.toString();
    }
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
    if (isStudent(muikkuUserEntity)) {
      return String.format("muikku-student-%d", muikkuUserEntity.getId());
    }
    else {
      return String.format("muikku-staff-%d", muikkuUserEntity.getId());
    }
  }

  private SearchProvider getSearchProvider() {
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    if (searchProviderIterator.hasNext()) {
      return searchProviderIterator.next();
    } else {
      return null;
    }
  }

  private boolean isStudent(fi.otavanopisto.muikku.model.users.UserEntity userEntity) {
    EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userEntity);
    return roleEntity == null || roleEntity.getArchetype() == EnvironmentRoleArchetype.STUDENT;
  }
  
  private void addAdminsAsRoomOwners(RestApiClient client, MUCRoomEntity mucRoomEntity, List<OrganizationEntity> organizations) {
    SearchProvider searchProvider = getSearchProvider();
    if (searchProvider == null) {
      logger.severe("ElasticSearch missing");
      return;
    }
    Set<EnvironmentRoleArchetype> roleArchetypeFilter = new HashSet<>();
    roleArchetypeFilter.add(EnvironmentRoleArchetype.ADMINISTRATOR);
    roleArchetypeFilter.add(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER);
    SearchResult result = searchProvider.searchUsers(
        organizations,
        null,                     // searchString 
        null,                     // fields 
        roleArchetypeFilter, 
        null,                     // userGroupFilters 
        null,                     // workspaceFilters 
        null,                     // userIdentifiers 
        false,                    // includeInactiveStudents
        false,                    // includeHidden
        true,                     // onlyDefaultUsers
        0, 
        Integer.MAX_VALUE);
    List<Map<String, Object>> results = result.getResults();
    for (Map<String, Object> o : results) {
      Long userEntityId = Long.valueOf(o.get("userEntityId").toString());
      fi.otavanopisto.muikku.model.users.UserEntity userEntity = userEntityController.findUserEntityById(userEntityId);
      UserChatSettings userChatSetting = chatController.findUserChatSettings(userEntity);
      if (userChatSetting != null && UserChatVisibility.VISIBLE_TO_ALL.equals(userChatSetting.getVisibility())){
        ensureUserHasOwnership(client, mucRoomEntity, userEntity);
      }
    }
  }

  private String generateName(String title) {
    // convert to lower-case and replace spaces and slashes with a minus sign
    String urlName = title == null ? "" : StringUtils.lowerCase(title.replaceAll(" ", "-").replaceAll("/", "-"));
    // truncate consecutive minus signs into just one
    while (urlName.indexOf("--") >= 0) {
      urlName = urlName.replace("--", "-");
    }
    // get rid of accented characters and all special characters other than minus,
    // period, and underscore
    urlName = StringUtils.stripAccents(urlName).replaceAll("[^a-z0-9\\-\\.\\_]", "");
    return StringUtils.isBlank(urlName) ? StringUtils.substringBefore(UUID.randomUUID().toString(), "-") : urlName;
  }

}
