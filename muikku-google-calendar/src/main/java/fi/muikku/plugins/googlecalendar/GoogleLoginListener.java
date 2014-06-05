package fi.muikku.plugins.googlecalendar;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.auth.LoginEvent;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.calendar.CalendarController;
import fi.muikku.plugins.calendar.model.UserCalendar;
import fi.muikku.schooldata.UserController;

@Stateless
public class GoogleLoginListener {
  
  private static final String CALENDAR_SUMMARY = "Muikku";
  private static final String CALENDAR_DESCRIPTION = "Muikku";
  
  @Inject
  private UserController userController;

  @Inject
  private CalendarController calendarController;
  
  public void onLogin(@Observes LoginEvent event) throws CalendarServiceException {
    synchronized (this) {
      if ("googleoauth".equals(event.getStrategy())) {
        UserEntity userEntity = userController.findUserEntityById(event.getUserId());
        if (userEntity != null) {
          UserCalendar userCalendar = calendarController.findUserCalendarByUserAndProvider(userEntity, "google");
          if (userCalendar == null) {
            userCalendar = calendarController.createCalendar(userEntity, "google", CALENDAR_SUMMARY, CALENDAR_DESCRIPTION, Boolean.TRUE);
            // TODO: Share the calendar with logged user google identity
          }
        }
      }
    }
  }
  
}
