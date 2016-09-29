package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataPersonsUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.persons.batchsize", "20"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "persons";
  }

  @Override
  public void synchronize() {
    int offset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus persons");
      int result = pyramusUpdater.updatePersons(offset, BATCH_SIZE);
      if (result == -1) {
        updateOffset(0);
      } else {
        count = result;
        updateOffset(offset + BATCH_SIZE);
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus persons", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 1;
  }
}