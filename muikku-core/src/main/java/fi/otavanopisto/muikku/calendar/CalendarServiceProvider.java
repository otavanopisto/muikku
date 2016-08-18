package fi.otavanopisto.muikku.calendar;

import java.util.List;

import java.time.OffsetDateTime;

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
   * @throws CalendarServiceException when service provider reports an error
   */
  public Calendar createCalendar(String summary, String description) throws CalendarServiceException;

  /**
   * Returns a calendar by id
   *
   * @param id calendar identifier
   * @return a calendar
   * @throws CalendarServiceException when service provider reports an error
   */
  public Calendar findCalendar(String id) throws CalendarServiceException;

  /**
   * Returns a list of public calendars
   *
   * @return a list of public calendars
   * @throws CalendarServiceException when service provider reports an error
   */
  public List<Calendar> listPublicCalendars() throws CalendarServiceException;

  /**
   * Updates a calendar
   *
   * @param calendar calendar to be updated
   * @return updated calendar
   * @throws CalendarServiceException when service provider reports an error
   */
  public Calendar updateCalendar(Calendar calendar) throws CalendarServiceException;;

  /**
   * Removes a calendar
   *
   * @param calendar calendar to be removed
   * @throws CalendarServiceException
   */
  public void deleteCalendar(Calendar calendar) throws CalendarServiceException;

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
   * @param allDay true if event is all day
   * @return newly created event
   * @throws CalendarServiceException when service provider reports an error
   */
  public CalendarEvent createEvent(String calendarId,
                                   String summary,
                                   String description,
                                   CalendarEventStatus status,
                                   List<CalendarEventAttendee> attendees,
                                   CalendarEventTemporalField start,
                                   CalendarEventTemporalField end,
                                   List<CalendarEventReminder> reminders,
                                   String recurrence,
                                   boolean allDay)
          throws CalendarServiceException;

  /**
   * Returns single calendar event by id
   *
   * @param calendar calendar which owns the event
   * @param eventId id of the event
   * @return a single calendar event
   * @throws CalendarServiceException when service provider reports an error
   */
  public CalendarEvent findEvent(Calendar calendar, String eventId) throws CalendarServiceException;

  /**
   * Returns a list of events from specified calendars
   *
   * @param calendarId
   * @return
   * @throws CalendarServiceException when service provider reports an error
   */
  public List<CalendarEvent> listEvents(String... calendarId) throws CalendarServiceException;

  /**
   * Returns a list of events from specified calendars within a specified time span
   *
   * @param calendarId
   * @param minTime lower bound of time filter. If null is specified results are not limited this constraint
   * @param maxTime upper bound of time filter. If null is specified results are not limited this constraint
   * @return a list of events from specified calendars within a specified time span
   * @throws CalendarServiceException when service provider reports an error
   */
  public List<CalendarEvent> listEvents(OffsetDateTime minTime, OffsetDateTime maxTime, String... calendarId) throws CalendarServiceException;

  /**
   * Updates existing calendar event
   *
   * @param calendarEvent event to be updated
   * @return updated calendar event
   * @throws CalendarServiceException when service provider reports an error
   */
  public CalendarEvent updateEvent(CalendarEvent calendarEvent) throws CalendarServiceException;

  /**
   * Removes a calendar event
   *
   * @param calendar calendar which owns the event to be removed
   * @param eventId id of event to be removed
   * @throws CalendarServiceException when service provider reports an error
   */
  public void deleteEvent(Calendar calendar, String eventId) throws CalendarServiceException;
}
