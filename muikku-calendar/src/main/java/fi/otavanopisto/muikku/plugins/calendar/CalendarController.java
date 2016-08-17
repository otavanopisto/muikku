package fi.otavanopisto.muikku.plugins.calendar;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.calendar.Calendar;
import fi.otavanopisto.muikku.calendar.CalendarEvent;
import fi.otavanopisto.muikku.calendar.CalendarEventAttendee;
import fi.otavanopisto.muikku.calendar.CalendarEventReminder;
import fi.otavanopisto.muikku.calendar.CalendarEventStatus;
import fi.otavanopisto.muikku.calendar.CalendarServiceException;
import fi.otavanopisto.muikku.calendar.CalendarServiceProvider;
import fi.otavanopisto.muikku.calendar.DefaultCalendarEventTemporalField;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.calendar.dao.UserCalendarDAO;
import fi.otavanopisto.muikku.plugins.calendar.model.UserCalendar;

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

  public UserCalendar findUserCalendarByUserAndProvider(UserEntity user, String provider) {
    return userCalendarDAO.findByUserIdAndCalendarProvider(user.getId(), provider);
  }

  public List<UserCalendar> listUserCalendars(UserEntity user) {
    return userCalendarDAO.listByUserId(user.getId());
  }

  public List<Long> listUserCalendarIds(UserEntity user) {
    return userCalendarDAO.listIdsByUserId(user.getId());
  }

  public Calendar updateCalendar(UserCalendar userCalendar, Calendar calendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    if (!userCalendar.getCalendarProvider().equals(calendar.getServiceProvider())) {
      throw new CalendarServiceException("Tried to change calendar provider with update calendar call");
    }

    if (!userCalendar.getCalendarId().equals(calendar.getId())) {
      throw new CalendarServiceException("Tried to change calendar id with update calendar call");
    }

    return provider.updateCalendar(calendar);
  }

  public void deleteCalendar(UserCalendar userCalendar) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    provider.deleteCalendar(calendar);
  }

  public CalendarEvent createCalendarEvent(UserCalendar userCalendar, String summary, String description, CalendarEventStatus status,
    Date start, TimeZone startTimeZone, Date end, TimeZone endTimeZone, List<CalendarEventAttendee> attendees, List<CalendarEventReminder> reminders,
    String recurrence, boolean allDay, Map<String, String> extendedProperties) throws CalendarServiceException {

    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    return provider.createEvent(calendar.getId(), summary, description, status, attendees, new DefaultCalendarEventTemporalField(start, startTimeZone), new DefaultCalendarEventTemporalField(end, endTimeZone), reminders, recurrence, allDay);
  }

  public fi.otavanopisto.muikku.calendar.CalendarEvent findCalendarEvent(UserCalendar userCalendar, String eventId) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    return provider.findEvent(calendar, eventId);
  }

  public List<fi.otavanopisto.muikku.calendar.CalendarEvent> listCalendarEvents(UserCalendar userCalendar, OffsetDateTime timeMin, OffsetDateTime timeMax) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    if (timeMin != null || timeMax != null) {
      return provider.listEvents(timeMin, timeMax, calendar.getId());
    } else {
      return provider.listEvents(calendar.getId());
    }
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

    return provider.updateEvent(calendarEvent);
  }

  public void deleteCalendarEvent(UserCalendar userCalendar, String eventId) throws CalendarServiceException {
    CalendarServiceProvider provider = getCalendarServiceProvider(userCalendar.getCalendarProvider());

    Calendar calendar = provider.findCalendar(userCalendar.getCalendarId());
    if (calendar == null) {
      throw new CalendarServiceException("Could not find calendar for user calendar #" + userCalendar.getId());
    }

    provider.deleteEvent(calendar, eventId);
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
