package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.AccessTimeout;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Timeout;
import javax.ejb.Timer;
import javax.ejb.TimerConfig;
import javax.ejb.TimerService;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.IteratorUtils;

import fi.muikku.events.ContextDestroyedEvent;
import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Singleton
@ApplicationScoped
@AccessTimeout (
  value = 30,
  unit = TimeUnit.SECONDS
)
public class PyramusScheduler {

  private static final int INITIAL_TIMEOUT = 1000 * 180; // 180 sec
  private static final int TIMEOUT = 1000 * 15; // 15 sec 
  private static final int ERROR_TIMEOUT = 1000 * 60; // 60 sec 
  
  @Any
  @Inject
  private Instance<PyramusUpdateScheduler> updateSchedulers;
  
  @Resource
  private TimerService timerService;
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() {
    contextInitialized = false;
    running = false;
    schedulerIndex = 0;
    
    timerService.createSingleActionTimer(INITIAL_TIMEOUT, new TimerConfig());
  }
  
  public void onContextInitialized(@Observes ContextInitializedEvent event) {
    contextInitialized = true;
  }

  public void onContextDestroyed(@Observes ContextDestroyedEvent event) {
    contextInitialized = false;
  }
  
  @Timeout
  public void syncTimeout(Timer timer) {
    try {
      synchronizePyramusData();

      timerService.createSingleActionTimer(TIMEOUT, new TimerConfig());
    } catch (Exception ex) {
      logger.log(Level.SEVERE, "synchronization failed.", ex);
      
      timerService.createSingleActionTimer(ERROR_TIMEOUT, new TimerConfig());
    }
  }
  
//  @Schedule(minute = "*/1", hour = "*", persistent = false)
  public void synchronizePyramusData() {
    if (!SchoolDataPyramusPluginDescriptor.SCHEDULERS_ACTIVE) {
      return;
    }
    
    if (contextInitialized) {
      if (running) {
        return;  
      }

      @SuppressWarnings("unchecked")
      List<PyramusUpdateScheduler> schedulers = IteratorUtils.toList(updateSchedulers.iterator());
      Collections.sort(schedulers, new Comparator<PyramusUpdateScheduler>() {
        @Override
        public int compare(PyramusUpdateScheduler o1, PyramusUpdateScheduler o2) {
          return o1.getPriority() - o2.getPriority();
        }
      });
      
      PyramusUpdateScheduler updateScheduler = schedulers.get(schedulerIndex);

      try {
        running = true;
        updateScheduler.synchronize();
      } catch (Exception ex) {
        logger.log(Level.SEVERE, "synchronization failed.", ex);
      } finally {
        running = false;
      }

      schedulerIndex = (schedulerIndex + 1) % schedulers.size();
    }
  }
  
  private boolean contextInitialized;
  private boolean running;
  private int schedulerIndex;
}
