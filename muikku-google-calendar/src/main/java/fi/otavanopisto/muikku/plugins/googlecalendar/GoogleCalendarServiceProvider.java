package fi.otavanopisto.muikku.plugins.googlecalendar;

import java.util.List;

import javax.inject.Inject;

import org.threeten.bp.ZonedDateTime;

import fi.otavanopisto.muikku.calendar.CalendarEvent;
import fi.otavanopisto.muikku.calendar.CalendarEventAttendee;
import fi.otavanopisto.muikku.calendar.CalendarEventReminder;
import fi.otavanopisto.muikku.calendar.CalendarEventStatus;
import fi.otavanopisto.muikku.calendar.CalendarEventTemporalField;
import fi.otavanopisto.muikku.calendar.CalendarServiceException;
import fi.otavanopisto.muikku.calendar.CalendarServiceProvider;

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
  public List<fi.otavanopisto.muikku.calendar.Calendar> listPublicCalendars() throws CalendarServiceException {
    return calendarClient.listPublicCalendars();
  }

  @Override
  public fi.otavanopisto.muikku.calendar.Calendar createCalendar(String summary, String description) throws CalendarServiceException {
    return calendarClient.createCalendar(summary, description);
  }

  @Override
  public fi.otavanopisto.muikku.calendar.Calendar findCalendar(String id) throws CalendarServiceException {
    return calendarClient.findCalendar(id);
  }

  @Override
  public CalendarEvent findEvent(fi.otavanopisto.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    return calendarClient.findEvent(calendar, eventId);
  }

  @Override
  public fi.otavanopisto.muikku.calendar.Calendar updateCalendar(fi.otavanopisto.muikku.calendar.Calendar calendar) throws CalendarServiceException {
    return calendarClient.updateCalendar(calendar);
  }

  @Override
  public void deleteCalendar(fi.otavanopisto.muikku.calendar.Calendar calendar) throws CalendarServiceException {
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
          String recurrence,
          boolean allDay) throws CalendarServiceException {
    return calendarClient.createEvent(calendarId, summary, description, status, attendees, start, end, recurrence, allDay);
  }

  @Override
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException {
    return calendarClient.listEvents(calendarId);
  }

  @Override
  public List<CalendarEvent> listEvents(ZonedDateTime minTime, ZonedDateTime maxTime, String... calendarId) throws CalendarServiceException {
    return calendarClient.listEvents(minTime, maxTime, calendarId);
  }

  @Override
  public CalendarEvent updateEvent(CalendarEvent calendarEvent) throws CalendarServiceException {
    return calendarClient.updateEvent(calendarEvent);
  }

  @Override
  public void deleteEvent(fi.otavanopisto.muikku.calendar.Calendar calendar, String eventId) throws CalendarServiceException {
    calendarClient.deleteEvent(calendar, eventId);
  }
}
