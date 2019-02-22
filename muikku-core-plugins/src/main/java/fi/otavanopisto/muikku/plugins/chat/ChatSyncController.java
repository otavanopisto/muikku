package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
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
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

@Stateless
public class ChatSyncController {

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private CourseMetaController courseMetaController;
    
  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;

  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private ChatController chatController;

  @Inject
  private Event<WorkspaceChatSettingsEnabledEvent> workspaceChatSettingsEnabledEvent;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  public void syncStudent(SchoolDataIdentifier studentIdentifier){

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
    
    SecureRandom random = new SecureRandom();
    User user = userController.findUserByDataSourceAndIdentifier(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier()); 

    String userSchoolDataSource = user.getSchoolDataSource();
    String userIdentifier = user.getIdentifier();
    
    try {
      // Checking before creating is subject to a race condition, but in the worst case
      // the creation just fails, resulting in a log entry
      UserEntity userEntity = client.getUser(studentIdentifier.toId());
      if (userEntity == null) {
        logger.log(Level.INFO, "Syncing chat user " + userSchoolDataSource+ "/" + userIdentifier);
        // Can't leave the password empty, so next best thing is random passwords
        
        // The passwords are not actually used
        byte[] passwordBytes = new byte[20];
        random.nextBytes(passwordBytes);
        String password = Base64.encodeBase64String(passwordBytes);

        userEntity = new UserEntity(userSchoolDataSource + "-" + userIdentifier, user.getDisplayName(), "", password);
        client.createUser(userEntity);

        if (userSchoolDataSource == null || userIdentifier == null) {
          logger.log(Level.WARNING, "No user entity found for identifier " + studentIdentifier.getIdentifier() + ", skipping...");
        }
      }
        
      List<WorkspaceEntity> usersWorkspaces = workspaceController.listWorkspaceEntitiesByUser(userEntityController.findUserEntityByUser(user), false);

      for (WorkspaceEntity usersWorkspace : usersWorkspaces) {
        MUCRoomEntity chatRoomEntity = client.getChatRoom(usersWorkspace.getIdentifier());
        Workspace workspace = workspaceController.findWorkspace(usersWorkspace);
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
        WorkspaceChatSettings workspaceChatSettings = chatController.findWorkspaceChatSettings(usersWorkspace.getId());
       
        if (workspaceChatSettings != null && workspaceChatSettings.getStatus() == WorkspaceChatStatus.ENABLED) {
          if (hasCorrectCurriculums) {
          
            if (chatRoomEntity == null) {
              logger.log(Level.INFO, "Syncing chat workspace " + usersWorkspace.getUrlName());
              if (userIdentifier == null) {
                logger.log(Level.WARNING, "Invalid workspace identifier " + userIdentifier + ", skipping...");
                continue;
              }
            
              String subjectCode = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();
              
              String roomName = subjectCode + workspace.getCourseNumber() + " - " + workspace.getNameExtension();
              
              chatRoomEntity = new MUCRoomEntity(workspace.getIdentifier(), roomName, workspace.getDescription());
              chatRoomEntity.setPersistent(true);
              chatRoomEntity.setLogEnabled(true);
              client.createChatRoom(chatRoomEntity);
            }  

            EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(studentIdentifier);
            if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(role.getArchetype()) || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(role.getArchetype())) {
              client.addAdmin(workspace.getIdentifier(), userSchoolDataSource +"-"+ userIdentifier);
            } else {
              client.addMember(workspace.getIdentifier(), userSchoolDataSource +"-"+ userIdentifier);
            }
          } 
        }
      }
    } catch (Exception e) {
      logger.log(Level.INFO, "Exception when syncing user " + studentIdentifier.getIdentifier(), e);
    } 
  }
  
  public void removeChatRoomMembership(SchoolDataIdentifier studentIdentifier, WorkspaceEntity workspaceEntity) {
    
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
    
    User user = userController.findUserByDataSourceAndIdentifier(studentIdentifier.getDataSource(), studentIdentifier.getIdentifier()); 

    String userSchoolDataSource = user.getSchoolDataSource();
    String userIdentifier = user.getIdentifier();
    
    Workspace workspace = workspaceController.findWorkspace(workspaceEntity);

    String roomName = workspace.getIdentifier();
    String jid = userSchoolDataSource + "-" + userIdentifier;
    
    client.deleteMember(roomName, jid);
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
    
    client.deleteChatRoom(workspaceEntity.getIdentifier());
    

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
    
    String roomName = subjectCode + workspace.getCourseNumber() + " - " + workspace.getNameExtension();
    MUCRoomEntity chatRoomEntity = client.getChatRoom(workspace.getIdentifier());

    chatRoomEntity = new MUCRoomEntity(workspace.getIdentifier(), roomName, workspace.getDescription());
    chatRoomEntity.setPersistent(true);
    chatRoomEntity.setLogEnabled(true);
    client.createChatRoom(chatRoomEntity);
    
    workspaceChatSettingsEnabledEvent.fire(new WorkspaceChatSettingsEnabledEvent(workspace.getSchoolDataSource(), workspace.getIdentifier(), true));
  }
 
 public void syncWorkspaceUser(WorkspaceEntity workspaceEntity, SchoolDataIdentifier userIdentifier) {
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

    EnvironmentRoleEntity role = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(userIdentifier);
    if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(role.getArchetype()) || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(role.getArchetype())) {
      client.addAdmin(workspace.getIdentifier(), userIdentifier.getDataSource() +"-"+ userIdentifier.getIdentifier());
    } else {
      client.addMember(workspace.getIdentifier(), userIdentifier.getDataSource() +"-"+ userIdentifier.getIdentifier());
   }
   
 }
}

