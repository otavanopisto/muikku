package fi.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.muikku.schooldata.UnexpectedSchoolDataBridgeException;

@Dependent
@Stateful
public class PyramusSchoolDataRolesUpdateScheduler implements PyramusUpdateScheduler {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  /* (non-Javadoc)
   * @see fi.muikku.plugins.schooldatapyramus.schedulers.PyramusUpdateScheduler#synchronizeWorkspaceUsers()
   */
  @Override
  public void synchronize() throws UnexpectedSchoolDataBridgeException {
    int count = 0;
    try {
      logger.info("Synchronizing Pyramus roles");
      count = pyramusUpdater.updateUserRoles();
    } finally {
      logger.info(String.format("Synchronized %d Pyramus roles", count));
    }
  }

}
