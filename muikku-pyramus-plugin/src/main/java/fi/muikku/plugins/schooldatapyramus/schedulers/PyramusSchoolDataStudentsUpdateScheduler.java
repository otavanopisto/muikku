package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Asynchronous;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@Singleton
@Asynchronous
public class PyramusSchoolDataStudentsUpdateScheduler {
  
  private static final int BATCH_SIZE = 100;
  
  @Inject
  private Logger logger;
  
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
  
  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizeStudents() throws UnexpectedSchoolDataBridgeException {
    if (contextInitialized) {
      if (running) {
        return;  
      }
      
      running = true;
      int count = 0;
      try {
        logger.info("Synchronizing Pyramus students");
        int result = pyramusUpdater.updateStudents(offset, BATCH_SIZE);
        if (result == -1) {
          offset = 0;
          count = 0;
        } else {
          count = result;
          offset += BATCH_SIZE;
        }
      } finally {
        logger.info(String.format("Synchronized %d Pyramus students", count));
        running = false;
      }
    }
  }
  
  private boolean contextInitialized;
  private boolean running;
  private int offset = 0;
}