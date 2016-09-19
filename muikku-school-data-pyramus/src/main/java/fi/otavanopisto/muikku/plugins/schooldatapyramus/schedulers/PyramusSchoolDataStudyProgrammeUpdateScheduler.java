package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataStudyProgrammeUpdateScheduler implements PyramusUpdateScheduler {

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public void synchronize() {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus studyprogrammes");
      count = pyramusUpdater.updateStudyProgrammes();
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus studyprogrammes", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 3;
  }
}