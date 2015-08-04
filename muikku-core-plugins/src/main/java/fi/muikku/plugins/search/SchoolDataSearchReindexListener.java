package fi.muikku.plugins.search;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.Resource;
import javax.ejb.Singleton;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.search.SearchIndexer;
import fi.muikku.search.SearchReindexEvent;
import fi.muikku.users.UserController;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupController;
import fi.muikku.users.UserGroupEntityController;
import fi.muikku.users.UserSchoolDataIdentifierController;

@ApplicationScoped
@Singleton
public class SchoolDataSearchReindexListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController; 

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Resource
  private TimerService timerService;

  private int userIndex = 0;
  private int groupIndex = 0;
  private int workspaceIndex = 0;
  private static int BATCH = 100;
  
  public void onReindexEvent(@Observes SearchReindexEvent event) {
    userIndex = 0;
    workspaceIndex = 0;
    
    logger.log(Level.INFO, "Reindex initiated.");
    
    timerService.createSingleActionTimer(5000, new TimerConfig());
  }

  @Timeout
  private void onTimeOut(Timer timer) {
    timer.cancel();

    logger.log(Level.INFO, "Commencing Reindex task.");
    try {
      boolean alldone = reindexWorkspaceEntities() || reindexUsers() || reindexUserGroups();
  
      if (!alldone)
        timerService.createSingleActionTimer(5000, new TimerConfig());
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Reindexing of entities failed.", ex);
    }
  }
  
  private boolean reindexWorkspaceEntities() {
    List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
    
    if (workspaceIndex < workspaceEntities.size()) {
      int last = Math.min(workspaceEntities.size(), workspaceIndex + BATCH);
      
      for (int i = workspaceIndex; i < last; i++) {
        WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
        workspaceIndexer.indexWorkspace(workspaceEntity);
      }

      logger.log(Level.INFO, "Reindexed batch of workspaces (" + workspaceIndex + "-" + last + ")");
      
      workspaceIndex += BATCH;
      return false;
    } else
      return true;
  }

  private boolean reindexUsers() {
    List<UserEntity> users = userEntityController.listUserEntities();
    
    if (userIndex < users.size()) {
      int last = Math.min(users.size(), userIndex + BATCH);
      
      for (int i = userIndex; i < last; i++) {
        UserEntity userEntity = users.get(i);

        List<UserSchoolDataIdentifier> identifiers = userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(userEntity);

        for (UserSchoolDataIdentifier identifier : identifiers) {
          User user = userController.findUserByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
          try {
            indexer.index(User.class.getSimpleName(), user);
          } catch (Exception e) {
            logger.log(Level.WARNING, "could not index User #" + user.getSchoolDataSource() + '/' + user.getIdentifier(), e);
          }
        }
      }
      
      logger.log(Level.INFO, "Reindexed batch of users (" + userIndex + "-" + last + ")");

      userIndex += BATCH;
      return false;
    } else
      return true;
  }
  
  private boolean reindexUserGroups() {
    List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupEntities();
    
    if (groupIndex < userGroups.size()) {
      int last = Math.min(userGroups.size(), groupIndex + BATCH);
      
      for (int i = groupIndex; i < last; i++) {
        UserGroupEntity groupEntity = userGroups.get(i);

        UserGroup userGroup = userGroupController.findUserGroup(groupEntity.getSchoolDataSource(), groupEntity.getIdentifier());
        
        try {
          indexer.index(UserGroup.class.getSimpleName(), userGroup);
        } catch (Exception e) {
          logger.log(Level.WARNING, "could not index UserGroup #" + groupEntity.getSchoolDataSource() + '/' + groupEntity.getIdentifier(), e);
        }
      }
      
      logger.log(Level.INFO, "Reindexed batch of usergroups (" + groupIndex + "-" + last + ")");

      groupIndex += BATCH;
      return false;
    } else
      return true;
  }
  
}
