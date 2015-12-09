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

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserGroupEntity;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.WorkspaceEntityController;
import fi.muikku.schooldata.entity.UserGroup;
import fi.muikku.search.SearchIndexer;
import fi.muikku.search.SearchReindexEvent;
import fi.muikku.users.UserEntityController;
import fi.muikku.users.UserGroupController;
import fi.muikku.users.UserGroupEntityController;

@ApplicationScoped
@Singleton
public class SchoolDataSearchReindexListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserGroupController userGroupController;
  
  @Inject
  private UserGroupEntityController userGroupEntityController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private SearchIndexer indexer;
  
  @Inject
  private UserIndexer userIndexer;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Resource
  private TimerService timerService;

  private static final int DEFAULT_TIMEOUT_SECONDS = 5;
  private static final int DEFAULT_BATCH_SIZE = 50;
  
  public void onReindexEvent(@Observes SearchReindexEvent event) {
    setOffset("userIndex", 0);
    setOffset("workspaceIndex", 0);
    setOffset("groupIndex", 0);
    
    logger.log(Level.INFO, "Reindex initiated.");

    startTimer(getTimeout());
  }

  @Timeout
  private void onTimeOut(Timer timer) {
    logger.log(Level.INFO, "Commencing Reindex task.");
    try {
      boolean alldone = reindexUserGroups() && reindexUsers() && reindexWorkspaceEntities();
  
      if (!alldone)
        startTimer(getTimeout());
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Reindexing of entities failed.", ex);
    }
  }
  
  private boolean reindexWorkspaceEntities() {
    try {
      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
      int workspaceIndex = getOffset("workspaceIndex");
      
      if (workspaceIndex < workspaceEntities.size()) {
        int last = Math.min(workspaceEntities.size(), workspaceIndex + getBatchSize());
        
        for (int i = workspaceIndex; i < last; i++) {
          WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
          workspaceIndexer.indexWorkspace(workspaceEntity);
        }
    
        logger.log(Level.INFO, "Reindexed batch of workspaces (" + workspaceIndex + "-" + last + ")");
        
        setOffset("workspaceIndex", workspaceIndex + getBatchSize());
        return false;
      } else
        return true;
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing workspace entities.", ex);
      return true;
    }
  }

  private boolean reindexUsers() {
    try {
      List<UserEntity> users = userEntityController.listUserEntities();
      int userIndex = getOffset("userIndex");
      
      if (userIndex < users.size()) {
        int last = Math.min(users.size(), userIndex + getBatchSize());
        
        for (int i = userIndex; i < last; i++) {
          try {
            UserEntity userEntity = users.get(i);
            
            userIndexer.indexUser(userEntity);
          } catch (Exception uex) {
            logger.log(Level.SEVERE, "Failed indexing userentity", uex);
          }
        }
        
        logger.log(Level.INFO, "Reindexed batch of users (" + userIndex + "-" + last + ")");
  
        setOffset("userIndex", userIndex + getBatchSize());
        return false;
      } else
        return true;
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing user entities.", ex);
      return true;
    }
  }
  
  private boolean reindexUserGroups() {
    try {
      List<UserGroupEntity> userGroups = userGroupEntityController.listUserGroupEntities();
      int groupIndex = getOffset("groupIndex");
      
      if (groupIndex < userGroups.size()) {
        int last = Math.min(userGroups.size(), groupIndex + getBatchSize());
        
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
  
        setOffset("groupIndex", groupIndex + getBatchSize());
        return false;
      } else
        return true;
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing usergroup entities.", ex);
      return true;
    }
  }
  
  private int getBatchSize() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer.batch"), DEFAULT_BATCH_SIZE);
  }
  
  private int getTimeout() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer.timeout"), DEFAULT_TIMEOUT_SECONDS) * 1000;
  }
  
  private int getOffset(String var) {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", "school-data.reindexer." + var + ".offset"));
  }
  
  private void setOffset(String var, int offset) {
    pluginSettingsController.setPluginSetting("school-data", "school-data.reindexer." + var + ".offset", String.valueOf(offset));
  }
  
  private void startTimer(int duration) {
    if (this.timer != null) {
      this.timer.cancel();
      this.timer = null;
    }
    
    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);
    
    this.timer = timerService.createSingleActionTimer(duration, timerConfig);
  }
  
  private Timer timer;
}
