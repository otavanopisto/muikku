package fi.otavanopisto.muikku.plugins.search;

import java.util.List;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
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

import fi.otavanopisto.muikku.controller.PermissionController;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.security.Permission;
import fi.otavanopisto.muikku.model.security.WorkspaceGroupPermission;
import fi.otavanopisto.muikku.model.users.UserGroupEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.WorkspaceSignupPermissionsSynchronizeEvent;

@ApplicationScoped
@Singleton
public class WorkspaceSignupPermissionsSyncronizerListener {
  
  private static final String WORKSPACE_SIGNUP = "WORKSPACE_SIGNUP";
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private PermissionController permissionController;
  
  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private WorkspaceIndexer workspaceIndexer;
  
  @Resource
  private TimerService timerService;

  private static final int DEFAULT_TIMEOUT_SECONDS = 5;
  private static final int DEFAULT_BATCH_SIZE = 50;
  private static final String DEFAULT_NAME = "signupsynchronizer";

  
  @PostConstruct
  public void init() {
    active = false;
  }
  
  public void onReindexEvent(@Observes WorkspaceSignupPermissionsSynchronizeEvent event) {
    if (active) {
      logger.log(Level.INFO, "Already reindexing, refused to start another reindexing task.");
      return;
    }
    
    active = true;
    
    if (!event.isResume()) {
      setOffset("workspaceIndex", 0);
    }
    
    logger.log(Level.INFO, "Workspace Signup Group Synchronization task initiated.");

    startTimer(getTimeout());
  }

  @Timeout
  private void onTimeOut(Timer timer) {
    logger.log(Level.INFO, "Commencing Workspace Signup Group Synchronization task.");
    try {
      boolean allDone = synchronizeWorkspaceSignupGroups();
     
      if (!allDone) {
        startTimer(getTimeout());
      } else {
        logger.log(Level.INFO, "Workspace Permission Synchronization complete.");
        active = false;
      }
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Workspace Permission Synchronization of entities failed.", ex);
    }
  }
  
  private boolean synchronizeWorkspaceSignupGroups() {
    try {
      List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntities();
      int workspaceIndex = getOffset("workspaceIndex");
      
      if (workspaceIndex < workspaceEntities.size()) {
        int last = Math.min(workspaceEntities.size(), workspaceIndex + getBatchSize());
        
        Permission permission = permissionController.findByName(WORKSPACE_SIGNUP);
        
        for (int i = workspaceIndex; i < last; i++) {
          WorkspaceEntity workspaceEntity = workspaceEntities.get(i);
          
          Set<SchoolDataIdentifier> workspaceSignupGroups = workspaceController.listWorkspaceSignupGroups(workspaceEntity);
          List<WorkspaceGroupPermission> workspaceGroupPermissions = permissionController.listByWorkspaceEntityAndPermission(workspaceEntity, permission);
          
          for (WorkspaceGroupPermission workspaceGroupPermission : workspaceGroupPermissions) {
            UserGroupEntity userGroupEntity = workspaceGroupPermission.getUserGroup();
            
            if (!workspaceSignupGroups.contains(userGroupEntity.schoolDataIdentifier())) {
              workspaceController.addWorkspaceSignupGroup(workspaceEntity, userGroupEntity);
            }
          }
          
          workspaceIndexer.indexWorkspace(workspaceEntity);
        }
    
        logger.log(Level.INFO, "Reindexed batch of workspace signup groups (" + workspaceIndex + "-" + last + ")");
        
        setOffset("workspaceIndex", workspaceIndex + getBatchSize());
        return false;
      } else
        return true;
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "Could not finish indexing workspace entities.", ex);
      return true;
    }
  }

  private int getBatchSize() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", String.format("school-data.%s.batch", DEFAULT_NAME)), DEFAULT_BATCH_SIZE);
  }
  
  private int getTimeout() {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", String.format("school-data.%s.timeout", DEFAULT_NAME)), DEFAULT_TIMEOUT_SECONDS) * 1000;
  }
  
  private int getOffset(String var) {
    return NumberUtils.toInt(pluginSettingsController.getPluginSetting("school-data", String.format("school-data.%s.%s.offset", DEFAULT_NAME, var)));
  }
  
  private void setOffset(String var, int offset) {
    pluginSettingsController.setPluginSetting("school-data", String.format("school-data.%s.%s.offset", DEFAULT_NAME, var), String.valueOf(offset));
  }
  
  private void startTimer(int duration) {
    if (this.timer != null) {
      try {
        this.timer.cancel();
      } catch (Exception e) {
      }
      
      this.timer = null;
    }
    
    TimerConfig timerConfig = new TimerConfig();
    timerConfig.setPersistent(false);
    
    this.timer = timerService.createSingleActionTimer(duration, timerConfig);
  }
  
  private Timer timer;
  private boolean active;
}
