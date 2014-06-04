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
  public Calendar createCalendar(String summary, String description);
  
  /**
   * Returns a calendar by id
   * 
   * @param id calendar identifier
   * @return a calendar
   */
  public Calendar findCalendar(String id);
  
  /**
   * Returns a list of public calendars
   * 
   * @return a list of public calendars
   */
  public List<Calendar> listPublicCalendars();
  
  /**
   * Returns single calendar event by id
   * 
   * @param id id of the calendar event
   * @return a single calendar event
   */
  public CalendarEvent findEvent(String id);
  
  /**
   * Returns a list of events from specified calendars
   * 
   * @param calendarId
   * @return
   */
  public List<CalendarEvent> listEvents(String... calendarId);  

  /**
   * Returns a list of events from specified calendars within a specified time span
   * 
   * @param calendarId 
   * @param minTime
   * @param maxTime
   * @return a list of events from specified calendars within a specified time span
   */
  public List<CalendarEvent> listEvents(Date minTime, Date maxTime, String... calendarId);  
}
