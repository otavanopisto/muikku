package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@ApplicationScoped
public class PyramusSchoolDataStaffMembersUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.staffmembers.batchsize", "20"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "staffmembers";
  }

  @Override
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int offset = getOffset();
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus users");
      int result = pyramusUpdater.updateStaffMembers(offset, BATCH_SIZE);
      if (result == -1) {
        updateOffset(0);
      } else {
        count = result;
        updateOffset(offset + BATCH_SIZE);
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus users", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 1;
  }
}