package fi.otavanopisto.muikku.plugins.chat;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.infinispan.configuration.global.ShutdownHookBehavior;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.openfire.rest.client.RestApiClient;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.entity.MUCRoomEntity;
import fi.otavanopisto.muikku.openfire.rest.client.entity.UserEntity;
import fi.otavanopisto.muikku.schooldata.CourseMetaController;
import fi.otavanopisto.muikku.plugins.chat.dao.UserChatSettingsDAO;
import fi.otavanopisto.muikku.plugins.chat.model.UserChatSettings;
import fi.otavanopisto.muikku.rest.model.Student;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Curriculum;
import fi.otavanopisto.muikku.schooldata.entity.SchoolDataEntity;
import fi.otavanopisto.muikku.schooldata.entity.Subject;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceUser;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchProvider.Sort;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;

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
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private UserController userController;
  
  @Inject
  private UserEntityController userEntityController;


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

        userEntity = new UserEntity(userIdentifier, user.getDisplayName(), "", password);
        client.createUser(userEntity);

        if (userSchoolDataSource == null || userIdentifier == null) {
          logger.log(Level.WARNING, "No user entity found for identifier " + studentIdentifier.getIdentifier() + ", skipping...");
        }
      }
        
      List<WorkspaceEntity> usersWorkspaces = workspaceController.listWorkspaceEntitiesByUser(userEntityController.findUserEntityByUser(user), true);

      for (WorkspaceEntity usersWorkspace : usersWorkspaces) {
        MUCRoomEntity chatRoomEntity = client.getChatRoom(usersWorkspace.getIdentifier());
        Workspace workspace1 = workspaceController.findWorkspace(usersWorkspace);
        Set<SchoolDataIdentifier> curriculumIdentifiers = workspace1.getCurriculumIdentifiers();
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
            logger.log(Level.INFO, "Syncing chat workspace " + usersWorkspace.getUrlName());
            if (userIdentifier == null) {
              logger.log(Level.WARNING, "Invalid workspace identifier " + userIdentifier + ", skipping...");
              continue;
            }
            
            Workspace workspace = workspaceController.findWorkspace(usersWorkspace);
            String subjectCode = courseMetaController.findSubject(workspace.getSchoolDataSource(), workspace.getSubjectIdentifier()).getCode();
              
            String roomName = subjectCode + workspace.getCourseNumber() + " - " + workspace.getNameExtension();
              
            chatRoomEntity = new MUCRoomEntity(workspace.getIdentifier(), roomName, workspace.getDescription());
            chatRoomEntity.setPersistent(true);
            chatRoomEntity.setLogEnabled(true);
            chatRoomEntity.setPublicRoom(true);
            client.createChatRoom(chatRoomEntity);
              
            EnvironmentUser workspaceUserRole = environmentUserController.findEnvironmentUserByUserEntity(userEntityController.findUserEntityByUser(user)); 
            EnvironmentRoleEntity role = workspaceUserRole.getRole();
            if (EnvironmentRoleArchetype.ADMINISTRATOR.equals(role.getArchetype()) || EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(role.getArchetype())) {
              client.addAdmin(workspace.getIdentifier(), userIdentifier);
            } else {
              client.addMember(workspace.getIdentifier(), userIdentifier);
            }
          }  
        }
      }
    } catch (Exception e) {
      logger.log(Level.INFO, "Exception when syncing user " + studentIdentifier.getIdentifier(), e);
    } 
  }
}   

