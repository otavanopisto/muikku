package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.List;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.ContextDestroyedEvent;
import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.schooldatapyramus.PyramusIdentifierMapper;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;
import fi.muikku.schooldata.WorkspaceEntityController;

@Singleton
@Lock (LockType.READ)
public class PyramusSchoolDataWorkspaceUsersUpdateScheduler {
  
  private static final int BATCH_SIZE = 10;
  
  @Inject
  private Logger logger;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private PyramusIdentifierMapper identityMapper;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @PostConstruct
  public void init() {
    contextInitialized = false;
    running = false;
  }
  
  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    contextInitialized = true;
  }

  public void onContextDestroyed(@Observes ContextDestroyedEvent event) {
    contextInitialized = false;
  }
  
  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeWorkspaceUsers() throws UnexpectedSchoolDataBridgeException {
    if (!SchoolDataPyramusPluginDescriptor.SCHEDULERS_ACTIVE) {
      return;
    }
    
    if (contextInitialized) {
      if (running) {
        return;  
      }
      
      running = true;
      int count = 0;
      try {
        logger.info("Synchronizing Pyramus workspace users");
        
        List<WorkspaceEntity> workspaceEntities = workspaceEntityController.listWorkspaceEntitiesByDataSource(SchoolDataPyramusPluginDescriptor.SCHOOL_DATA_SOURCE, offset, BATCH_SIZE);
        if (workspaceEntities.size() == 0) {
          offset = 0;
        } else {
          for (WorkspaceEntity workspaceEntity : workspaceEntities) {
            Long courseId = identityMapper.getPyramusCourseId(workspaceEntity.getIdentifier());
            count += pyramusUpdater.updateCourseStaffMembers(courseId); 
          }
          
          offset += workspaceEntities.size();
        }
      } finally {
        logger.info(String.format("Synchronized %d Pyramus workspace users", count));
        running = false;
      }
    }
  }
  
  private boolean contextInitialized;
  private boolean running;
  private int offset = 0;
}
