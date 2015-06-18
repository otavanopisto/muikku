package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@ApplicationScoped
public class PyramusSchoolDataUserGroupUpdateScheduler implements PyramusUpdateScheduler {

  private static final int BATCH_SIZE = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.usergroups.batchsize", "100"));

  @Inject
  private Logger logger;

  @Inject
  private PyramusUpdater pyramusUpdater;

  @PostConstruct
  public void init() {
    offset = NumberUtils.createInteger(System.getProperty("muikku.pyramus-updater.usergroups.start", "0"));
  }
  
  @Override
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus usergroups");
      int result = pyramusUpdater.updateUserGroups(offset, BATCH_SIZE);
      if (result == -1) {
        offset = 0;
        count = 0;
      } else {
        count = result;
        offset += BATCH_SIZE;
      }
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus usergroups", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 3;
  }

  private int offset = 0;
}