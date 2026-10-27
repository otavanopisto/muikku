package fi.otavanopisto.muikku.plugins.cleaner;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

@Startup
@Singleton
public class CleanerAnswersScheduler {
  
  @Inject
  private CleanerAnswersController cleaner;

  // Every five minutes but a minute later than other schedulers firing at */5 
  @Schedule(hour = "*", minute = "1/5", persistent = false)
  public void cleanup() {
    cleaner.runCleanup();
  }
  
}
