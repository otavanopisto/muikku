package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataOrganizationsUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  @Override
  public String getSchedulerName() {
    return "organizations";
  }

  @Override
  public void synchronize() {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus organizations");
      count = pyramusUpdater.updateOrganizations();
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus organizations", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 0;
  }

}
