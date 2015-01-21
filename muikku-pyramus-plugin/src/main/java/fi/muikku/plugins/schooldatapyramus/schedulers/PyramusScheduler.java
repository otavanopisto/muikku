package fi.muikku.plugins.schooldatapyramus.schedulers;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.events.ContextDestroyedEvent;
import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@Singleton
@ApplicationScoped
public class PyramusScheduler {

  @Any
  @Inject
  private Instance<PyramusUpdateScheduler> updateSchedulers;
  
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
  public void synchronizePyramusData() throws UnexpectedSchoolDataBridgeException {
    if (!SchoolDataPyramusPluginDescriptor.SCHEDULERS_ACTIVE) {
      return;
    }
    for(PyramusUpdateScheduler updateScheduler : updateSchedulers){
      if (contextInitialized) {
        if (running) {
          return;  
        }
        try {
          running = true;
          updateScheduler.synchronize();
        } finally {
          running = false;
        }
      }
    }
  }
  
  private boolean contextInitialized;
  private boolean running;
}
