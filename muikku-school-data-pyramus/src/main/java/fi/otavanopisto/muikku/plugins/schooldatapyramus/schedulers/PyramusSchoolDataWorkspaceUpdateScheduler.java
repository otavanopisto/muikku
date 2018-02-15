package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataWorkspaceUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.workspaces.batchsize", "20"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "workspaces";
  }

  @Override
  public void synchronize() {
    int currentOffset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus workspaces");
      updateOffset(currentOffset + BATCH_SIZE);
      int result = pyramusUpdater.updateCourses(currentOffset, BATCH_SIZE);
      if (result == -1) {
        updateOffset(0);
      } else {
        count = result;
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus workspaces", count));

    }
  }
  
  @Override
  public int getPriority() {
    return 3;
  }
}