package fi.otavanopisto.muikku.plugins.search;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.search.SearchIndexer;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserGroupEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;

public class UserIndexer {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 

  @Inject
  private UserController userController;

  @Inject
  private UserEmailEntityController userEmailEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private SearchIndexer indexer;
  
  public void indexUser(String dataSource, String identifier) {
    SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(identifier, dataSource);
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByIdentifier(userIdentifier);
      if (user != null) {
        // TODO: we have only one role here but a user(entity) can have several roles via several userschooldataidentifiers
        UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
        EnvironmentRoleArchetype archetype = ((userSchoolDataIdentifier != null) && (userSchoolDataIdentifier.getRole() != null)) ? 
            userSchoolDataIdentifier.getRole().getArchetype() : null;
        
        if ((archetype != null) && (userSchoolDataIdentifier != null)) {
          UserEntity userEntity = userSchoolDataIdentifier.getUserEntity();
          
          boolean isDefaultIdentifier = (userEntity.getDefaultIdentifier() != null && userEntity.getDefaultSchoolDataSource() != null) ?
              userEntity.getDefaultIdentifier().equals(user.getIdentifier()) && 
              userEntity.getDefaultSchoolDataSource().getIdentifier().equals(user.getSchoolDataSource()) : false;
          Map<String, Object> extra = new HashMap<>();
          extra.put("archetype", archetype);
          extra.put("userEntityId", userEntity.getId());
          extra.put("isDefaultIdentifier", isDefaultIdentifier);
          
          Set<Long> workspaceEntityIds = new HashSet<Long>();
          Set<Long> userGroupIds = new HashSet<Long>();

          // List workspaces in which the student is active (TODO Should we have a separate variable for all workspaces?)
          List<WorkspaceEntity> workspaces = workspaceUserEntityController.listActiveWorkspaceEntitiesByUserIdentifier(userIdentifier);
          for (WorkspaceEntity workspace : workspaces) {
            workspaceEntityIds.add(workspace.getId());
          }
            
          extra.put("workspaces", workspaceEntityIds);
          
          List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
          for (UserGroupEntity userGroup : userGroups) {
            userGroupIds.add(userGroup.getId());
          }
          
          extra.put("groups", userGroupIds);

          if (EnvironmentRoleArchetype.TEACHER.equals(archetype) ||
              EnvironmentRoleArchetype.STUDY_GUIDER.equals(archetype) ||
              EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.equals(archetype) ||
              EnvironmentRoleArchetype.MANAGER.equals(archetype) ||
              EnvironmentRoleArchetype.ADMINISTRATOR.equals(archetype)) {
            String userDefaultEmailAddress = userEmailEntityController.getUserDefaultEmailAddress(userEntity, false);
            extra.put("email", userDefaultEmailAddress);
          }
          
          indexer.index(User.class.getSimpleName(), user, extra);
        } else {
          indexer.index(User.class.getSimpleName(), user);
        }
      } else {
        logger.info(String.format("Removing user %s/%s from index", identifier, dataSource));
        removeUser(dataSource, identifier);
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Indexing of user identifier " + identifier + " failed.", ex);
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    } 
  }
  
  public void indexUser(UserEntity userEntity) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);
      for (UserSchoolDataIdentifier schoolDataIdentifier : identifiers) {
        SchoolDataIdentifier identifier = schoolDataIdentifier.schoolDataIdentifier();
        indexUser(identifier);
      }
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
  }
  
  public void indexUser(SchoolDataIdentifier identifier) {
    indexUser(identifier.getDataSource(), identifier.getIdentifier());
  }

  public void removeUser(SchoolDataIdentifier identifier) {
    removeUser(identifier.getDataSource(), identifier.getIdentifier());
  }

  public void removeUser(String dataSource, String identifier) {
    try {
      indexer.remove(User.class.getSimpleName(), String.format("%s/%s", identifier, dataSource));
    } catch (Exception ex) {
      logger.log(Level.SEVERE, String.format("Removal of user %s/%s from index failed", dataSource, identifier), ex);
    } 
  }
  
}
