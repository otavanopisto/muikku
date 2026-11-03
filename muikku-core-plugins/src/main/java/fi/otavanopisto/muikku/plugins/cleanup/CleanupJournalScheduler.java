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
public class CleanupJournalScheduler {
  
  @Inject
  private Logger logger;
  
  @EJB
  private CleanupJournalJob job;

  @EJB
  private CleanupShutdown shutdown;

  // Every ten minutes, e.g. 9.02, 9.12, 9.22, etc.
  @Schedule(hour = "*", minute = "2/10", persistent = false)
  @TransactionAttribute(TransactionAttributeType.NOT_SUPPORTED)
  public void cleanup() {
    try {
      job.cleanup();
    }
    catch (Throwable t) {
      logger.log(Level.SEVERE, String.format("Scheduler emergency shutdown: %s", t.getMessage()));
      shutdown.disable(CleanupJournalJob.SETTING_ENABLED);
    }
  }
  
}
