package fi.muikku.calendar;

import java.util.Date;
import java.util.List;

public interface CalendarServiceProvider {

  /**
   * Returns name of calendar service provider
   *
   * @return name of calendar service provider
   */
  public String getName();

  /**
   * Returns whether service provider is read only
   *
   * @return whether service provider is read only
   */
  public boolean isReadOnly();

  /**
   * Creates a new calendar
   *
   * @param summary calendar summary (title)
   * @param description calendar description
   * @return
   */
  public Calendar createCalendar(String summary, String description) throws CalendarServiceException;

  /**
   * Returns a calendar by id
   *
   * @param id calendar identifier
   * @return a calendar
   */
  public Calendar findCalendar(String id) throws CalendarServiceException;

  /**
   * Returns a list of public calendars
   *
   * @return a list of public calendars
   */
  public List<Calendar> listPublicCalendars() throws CalendarServiceException;
  
  /**
   * Updates a calendar
   * 
   * @param calendar calendar to be updated
   * @return updated calendar
   */
  public Calendar updateCalendar(Calendar calendar) throws CalendarServiceException;;


  /**
   * Creates new calendar event into the calendar.
   *
   * @param calendarId calendar identifier
   * @param summary event summary (title)
   * @param description event description
   * @param status event status
   * @param attendees list of attendees
   * @param start start time
   * @param end end time
   * @param reminders list of reminders
   * @param recurrence event recurrence data
   * @return newly created event
   */
  public CalendarEvent createEvent(String calendarId, String summary, String description, CalendarEventStatus status,
      List<CalendarEventAttendee> attendees, CalendarEventTemporalField start, CalendarEventTemporalField end,
      List<CalendarEventReminder> reminders, CalendarEventRecurrence recurrence)
          throws CalendarServiceException;

  /**
   * Returns single calendar event by id
   *
   * @param id id of the calendar event
   * @return a single calendar event
   */
  public CalendarEvent findEvent(String id) throws CalendarServiceException;

  /**
   * Returns a list of events from specified calendars
   *
   * @param calendarId
   * @return
   */
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException;

  /**
   * Returns a list of events from specified calendars within a specified time span
   *
   * @param calendarId
   * @param minTime
   * @param maxTime
   * @return a list of events from specified calendars within a specified time span
   */
  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId) throws CalendarServiceException;

  /**
   * Updates existing calendar event
   * 
   * @param calendarEvent event to be updated
   * @return updated calendar event
   */
  public CalendarEvent updateEvent(CalendarEvent calendarEvent) throws CalendarServiceException;
}
