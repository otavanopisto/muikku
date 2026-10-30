package fi.otavanopisto.muikku.plugins.cleanup;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;

@Startup
@Singleton
public class CleanupAnswersScheduler {
  
  @Inject
  private Logger logger;
  
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
  @Schedule(hour = "*", minute = "1/5", persistent = false)
  @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
  public void cleanup() {
    try {
      job.cleanup();
    }
    catch (Throwable t) {
      // Only logging message as Wildfly has already logged stack trace
      logger.log(Level.SEVERE, String.format("Scheduler emergency shutdown: %s", t.getMessage()));
      shutdown.disable(CleanupAnswersJob.SETTING_ENABLED);
    }
  }
  
}
