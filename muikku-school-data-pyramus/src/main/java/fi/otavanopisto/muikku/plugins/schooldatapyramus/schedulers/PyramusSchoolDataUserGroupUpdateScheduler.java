package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataUserGroupUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.usergroups.batchsize", "40"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "usergroups";
  }
  
  @Override
  public void synchronize() {
    int currentOffset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus usergroups");
      updateOffset(currentOffset += BATCH_SIZE);
      int result = pyramusUpdater.updateStudentGroups(currentOffset, BATCH_SIZE);
      if (result == -1) {
        updateOffset(0);
      } else {
        count = result;
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus usergroups", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 3;
  }
}