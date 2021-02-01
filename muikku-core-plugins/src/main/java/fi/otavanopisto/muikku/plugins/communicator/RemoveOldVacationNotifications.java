package fi.otavanopisto.muikku.plugins.communicator;

import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.communicator.dao.VacationNotificationsDAO;

@Startup
@Singleton
public class RemoveOldVacationNotifications {
  
  @Inject
  private Logger logger;
  
  @Inject
  private VacationNotificationsDAO vacationNotificationsDAO;

  @Schedule (minute = "0", hour = "0", dayOfWeek="1", persistent = false) 
  public void cleanup() {
    
    long total = vacationNotificationsDAO.count();
    int countExpired = vacationNotificationsDAO.deleteOldNotifications();
    
    logger.info(String.format("Removed one week or older vacation notifications.", countExpired, total));
  }
  
}
