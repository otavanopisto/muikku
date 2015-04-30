package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@ApplicationScoped
public class PyramusSchoolDataWorkspaceUpdateScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = 100;

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus workspaces");
      int result = pyramusUpdater.updateCourses(offset, BATCH_SIZE);
      if (result == -1) {
        offset = 0;
        count = 0;
      } else {
        count = result;
        offset += BATCH_SIZE;
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus workspaces", count));

    }
  }
  
  @Override
  public int getPriority() {
    return 3;
  }

  private int offset = 0;
}