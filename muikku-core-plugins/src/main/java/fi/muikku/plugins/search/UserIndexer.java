package fi.muikku.plugins.search;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.SchoolDataIdentifier;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchIndexer;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.WorkspaceUserEntityController;

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
  private UserEntityController userEntityController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private SearchIndexer indexer;
  
  public void indexUser(String dataSource, String identifier) {
    schoolDataBridgeSessionController.startSystemSession();
    try {
      User user = userController.findUserByDataSourceAndIdentifier(dataSource, identifier);
      if (user != null) {
        EnvironmentRoleArchetype archetype = null;
        
        UserEntity userEntity = userEntityController.findUserEntityByDataSourceAndIdentifier(user.getSchoolDataSource(), user.getIdentifier());
        
        if (userEntity != null) {
          EnvironmentUser eu = environmentUserController.findEnvironmentUserByUserEntity(userEntity);
          
          if ((eu != null) && (eu.getRole() != null))
            archetype = eu.getRole().getArchetype();
        }
        
        if ((archetype != null) && (userEntity != null)) {
          SchoolDataIdentifier userIdentifier = new SchoolDataIdentifier(user.getIdentifier(), user.getSchoolDataSource());
          
          Map<String, Object> extra = new HashMap<>();
          extra.put("archetype", archetype);
          extra.put("userEntityId", userEntity.getId());
          
          Set<Long> workspaceEntityIds = new HashSet<Long>();
          Set<Long> userGroupIds = new HashSet<Long>();

          List<WorkspaceEntity> workspaces = workspaceUserEntityController.listWorkspaceEntitiesByUserIdentifier(userIdentifier);
          for (WorkspaceEntity workspace : workspaces) {
            workspaceEntityIds.add(workspace.getId());
          }
            
          extra.put("workspaces", workspaceEntityIds);
          
          List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupsByUserIdentifier(userIdentifier);
          for (UserGroupEntity userGroup : userGroups) {
            userGroupIds.add(userGroup.getId());
          }
          
          extra.put("groups", userGroupIds);
          
          indexer.index(User.class.getSimpleName(), user, extra);
        } else
          indexer.index(User.class.getSimpleName(), user);
      } else {
        logger.warning("could not index user because user '" + identifier + '/' + dataSource +  "' could not be found");
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
        SchoolDataIdentifier identifier = new SchoolDataIdentifier(schoolDataIdentifier.getIdentifier(), schoolDataIdentifier.getDataSource().getIdentifier());
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
