package fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers;

import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.PyramusUpdater;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeInternalException;

@ApplicationScoped
public class PyramusSchoolDataRolesUpdateScheduler implements PyramusUpdateScheduler {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PyramusUpdater pyramusUpdater;
  
  /* (non-Javadoc)
   * @see fi.otavanopisto.muikku.plugins.schooldatapyramus.schedulers.PyramusUpdateScheduler#synchronizeWorkspaceUsers()
   */
  @Override
  public void synchronize() throws SchoolDataBridgeInternalException {
    int count = 0;
    try {
      logger.fine("Synchronizing Pyramus roles");
      count = pyramusUpdater.updateUserRoles();
    } finally {
      logger.fine(String.format("Synchronized %d Pyramus roles", count));
    }
  }
  
  @Override
  public int getPriority() {
    return 0;
  }

}
