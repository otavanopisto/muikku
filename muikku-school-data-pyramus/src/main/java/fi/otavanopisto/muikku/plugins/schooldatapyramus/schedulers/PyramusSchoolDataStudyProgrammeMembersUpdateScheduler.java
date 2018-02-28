package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;

@ApplicationScoped
public class PyramusSchoolDataStudyProgrammeMembersUpdateScheduler extends PyramusDataScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.studyprogramme-members.batchsize", "100"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @Override
  public String getSchedulerName() {
    return "studyprogramme-members";
  }

  @Override
  public void prepare() {
    updateOffset(getOffset() + BATCH_SIZE);
  }
  
  public void synchronize() {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus study programme members (" + getOffset() + ")");
      int result = pyramusUpdater.updateStudyProgrammeMembers(getOffset(), BATCH_SIZE);
      if (result == -1) {
        updateOffset(0);
      } else {
        count = result;
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus students", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 4;
  }

}
