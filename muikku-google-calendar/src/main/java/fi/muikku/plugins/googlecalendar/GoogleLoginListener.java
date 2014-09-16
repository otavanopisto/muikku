package fi.muikku.plugins.googlecalendar;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.calendar.Calendar;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.events.LoginEvent;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.schooldata.UserController;

@Stateless
public class GoogleLoginListener {
  
  private static final String CALENDAR_SUMMARY = "Muikku";
  private static final String CALENDAR_DESCRIPTION = "Muikku";
  
  @Inject
  private Logger logger;
  
  @Inject
  private UserController userController;

  @Inject
  private CalendarController calendarController;

  public void onLogin(@Observes LoginEvent event) {
    synchronized (this) {
      if ("googleoauth".equals(event.getAuthProvider().getName())) {
        UserEntity userEntity = userController.findUserEntityById(event.getUserEntityId());
        if (userEntity != null) {
          UserCalendar userCalendar = calendarController.findUserCalendarByUserAndProvider(userEntity, "google");
          if (userCalendar == null) {
            try {
              userCalendar = calendarController.createCalendar(userEntity, "google", CALENDAR_SUMMARY, CALENDAR_DESCRIPTION, Boolean.TRUE);
              Calendar calendar = calendarController.loadCalendar(userCalendar);
            } catch (CalendarServiceException e) {
              logger.log(Level.SEVERE, "Could not initialize user calendar", e);
            }
            // TODO: share calendar with the user. Before we can do this we need to resolve what email are attached to 
            // user's google account.
//            calendarClient.insertCalendarUserAclRule(calendar.getId(), email, "owner");
          }
        }
      }
    }
  }
  
}
