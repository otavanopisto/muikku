package fi.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import fi.muikku.calendar.Calendar;
import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.CalendarServiceProvider;
import fi.muikku.calendar.DefaultCalendarEventTemporalField;
import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.calendar.dao.UserCalendarDAO;
import fi.muikku.plugins.calendar.model.UserCalendar;

@Dependent
@Stateless
public class CalendarController {

  @Inject
  @Any
  private Instance<CalendarServiceProvider> serviceProviders;

  @Inject
  private UserCalendarDAO userCalendarDAO;
  
  public UserCalendar createCalendar(UserEntity user, String serviceProvider, String summary, String description, Boolean visible) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(serviceProvider);
    if (provider != null) {
      Calendar calendar = provider.createCalendar(summary, description);
      if (calendar == null) {
        throw new CalendarServiceException("Could create calendar for service provider: " + serviceProvider);
      } else {
        return userCalendarDAO.create(calendar.getId(), serviceProvider, user.getId(), visible);
      }
    } else {
      throw new CalendarServiceException("Could not find calendar service provider: " + serviceProvider);
    }
  }

  public UserCalendar findUserCalendar(Long id) {
    return userCalendarDAO.findById(id);
  }
  
  public List<UserCalendar> listUserCalendars(UserEntity user) {
    return userCalendarDAO.listByUserId(user.getId());
  }

  public UserCalendar updateCalendar(UserCalendar userCalendar, String subject, String description) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }
    
    // TODO: Implement actual updating
    
    return userCalendar;
  }
  
  public void deleteCalendar(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }
    
    // TODO: Implement actual deleting
  }

  public CalendarEvent createCalendarEvent(UserCalendar userCalendar, String summary, String description, CalendarEventStatus status, 
    Date start, TimeZone startTimeZone, Date end, TimeZone endTimeZone, List<CalendarEventAttendee> attendees, List<CalendarEventReminder> reminders, 
    CalendarEventRecurrence recurrence, Map<String, String> extendedProperties) throws CalendarServiceException {
    
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }
    
    return provider.createEvent(calendar.getId(), summary, description, status, attendees, new DefaultCalendarEventTemporalField(start, startTimeZone), new DefaultCalendarEventTemporalField(end, endTimeZone), reminders, recurrence);
  }

  public fi.muikku.calendar.CalendarEvent findCalendarEvent(UserCalendar userCalendar, String eventId) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    return provider.findEvent(eventId);
  }

  public List<fi.muikku.calendar.CalendarEvent> listCalendarEvents(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    return provider.listEvents(calendar.getId());
  }

  public CalendarEvent updateCalendarEvent(UserCalendar userCalendar, CalendarEvent calendarEvent) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }
    
    if (StringUtils.isBlank(calendarEvent.getId())) {
      throw new CalendarServiceException("Cannot update event without id");
    }
    
    // TODO: Implement actual updating
    
    return calendarEvent;
  }

  public void deleteCalendarEvent(UserCalendar userCalendar, String eventId) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    
    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }
    
    // TODO: Implement actual deleting
  }
  
  public Calendar loadCalendar(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());
    if (provider != null) {
      Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
      return calendar;
    } else {
      throw new CalendarServiceException("Could not find calendar provider: " + userCalendar.getCalendarProvider());
    }
  }

  private CalendarServiceProvider getCalendarServiceProvider(String name) {
    Iterator<CalendarServiceProvider> iterator = serviceProviders.iterator();
    while (iterator.hasNext()) {
      CalendarServiceProvider serviceProvider = iterator.next();
      if (name.equals(serviceProvider.getName())) {
        return serviceProvider;
      }
    }

    return null;
  }

  @SuppressWarnings("unused")
  private List<CalendarServiceProvider> getCalendarServiceProviders() {
    List<CalendarServiceProvider> result = new ArrayList<>();
    CollectionUtils.addAll(result, serviceProviders.iterator());
    return Collections.unmodifiableList(result);
  }

}
