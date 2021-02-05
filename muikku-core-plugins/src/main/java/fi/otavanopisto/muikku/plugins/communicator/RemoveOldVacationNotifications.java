package fi.otavanopisto.muikku.plugins.communicator;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
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
    Date now = new Date();
    
    LocalDate nowDate = now.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

    nowDate = nowDate.minusDays(7);
    Date thresholdDate = java.sql.Date.valueOf(nowDate);
    
    int countExpired = vacationNotificationsDAO.deleteNotificationsOlderThan(thresholdDate);
    
    logger.info(String.format("Removed %d one week or older vacation notifications.", countExpired));
  }
  
}
