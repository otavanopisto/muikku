package fi.otavanopisto.muikku.plugins.cleanup;

import javax.ejb.EJB;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;

@Startup
@Singleton
public class CleanupAnswersScheduler {
  
  // Scheduler acts only as an orchestrator. It does not have a transaction of its own.
  // The two injected stateless EJBs will have their own separate transactions. Job
  // does the work but should it crash, especially on database level, shutdown can
  // still use its own transaction to disable this scheduler so that it won't bang its
  // head into the exact same wall in the next cycle.
  
  @EJB
  private CleanupAnswersJob job;

  @EJB
  private CleanupShutdown shutdown;

  // Every five minutes but a minute later than other schedulers firing at */5
  //@Schedule(hour = "*", minute = "1/5", persistent = false)
  @Schedule(hour = "*", minute = "*/1", persistent = false)
  @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
  public void cleanup() {
    try {
      job.cleanup();
    }
    catch (Throwable t) {
      shutdown.toggle(CleanupAnswersJob.SETTING_ENABLED, false);
    }
  }
  
}
