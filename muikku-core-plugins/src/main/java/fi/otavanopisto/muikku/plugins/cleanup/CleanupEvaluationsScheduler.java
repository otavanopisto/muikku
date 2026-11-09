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
public class CleanupEvaluationsScheduler {
  
  @Inject
  private Logger logger;
  
  @EJB
  private CleanupEvaluationsJob job;

  @EJB
  private CleanupShutdown shutdown;

  // Every seven minutes, e.g. 9.03, 9.10, 9.17, etc.
  @Schedule(hour = "*", minute = "3/7", persistent = false)
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
