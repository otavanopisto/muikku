package fi.muikku.plugins.googlecalendar;

import java.util.Date;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarServiceException;
import fi.muikku.calendar.CalendarServiceProvider;

public class GoogleCalendarServiceProvider implements CalendarServiceProvider {

  @Inject
  private GoogleCalendarClient calendarClient;

  @Override
  public String getName() {
    return "google";
  }

  @Override
  public boolean isReadOnly() {
    return false;
  }

  @Override
  public List<fi.muikku.calendar.Calendar> listPublicCalendars() throws CalendarServiceException {
    return calendarClient.listPublicCalendars();
  }

  @Override
  public fi.muikku.calendar.Calendar createCalendar(String summary, String description) throws CalendarServiceException {
    return calendarClient.createCalendar(summary, description);
  }

  @Override
  public fi.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    return calendarClient.findCalendar(id);
  }

  @Override
  public CalendarEvent findEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    return calendarClient.findEvent(calendar, eventId);
  }

  @Override
  public fi.muikku.calendar.Calendar updateCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    return calendarClient.updateCalendar(calendar);
  }

  @Override
  public void deleteCalendar(fi.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    calendarClient.deleteCalendar(calendar);
  }

  @Override
  public CalendarEvent createEvent(String calendarId,
          String summary,
          String description,
          CalendarEventStatus status,
          List<CalendarEventAttendee> attendees,
          CalendarEventTemporalField start,
          CalendarEventTemporalField end,
          List<CalendarEventReminder> reminders,
          CalendarEventRecurrence recurrence) throws CalendarServiceException {
    return calendarClient.createEvent(calendarId, summary, description, status, attendees, start, end);
  }

  @Override
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    return calendarClient.listEvents(calendarId);
  }

  @Override
  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId) throws CalendarServiceException {
    return calendarClient.listEvents(minTime, maxTime, calendarId);
  }

  @Override
  public CalendarEvent updateEvent(CalendarEvent calendarEvent) throws CalendarServiceException {
    return calendarClient.updateEvent(calendarEvent);
  }

  @Override
  public void deleteEvent(fi.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    calendarClient.deleteEvent(calendar, eventId);
  }
}
