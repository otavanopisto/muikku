package fi.otavanopisto.muikku.plugins.event;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.event.model.MuikkuEvent;

@Startup
@Singleton
public class AbsenceTrashScheduler {
  
  @Inject
  private Logger logger;

  @Inject 
  private MuikkuEventController muikkuEventController;
  
  @Schedule (minute = "0", hour = "0", dayOfWeek="1", persistent = false) 
  public void cleanup() {
    List<MuikkuEvent> events = muikkuEventController.listByTypeAndEnd();
    
    int count = 0;
    for (MuikkuEvent event : events) {
      try {
        muikkuEventController.deleteEvent(event);
        count++;
      } catch (Exception e) {
        logger.warning(String.format("Failed to delete absence event %d", event.getId()));
      }
    }
    
    logger.info(String.format("%d absences older than 12 months deleted", count));
  }
  
}
