package fi.otavanopisto.muikku.calendar;

import java.util.Date;
import java.util.List;
import java.util.Map;

public interface CalendarEvent {

  /**
   * Returns calendar event identifier
   * 
   * Identifier must be unique within service provider.
   * 
   * @return calendar event identifier
   */
  public String getId();
  
  /**
   * Returns calendar identifier this event belongs to
   * 
   * @return calendar identifier this event belongs to
   */
  public String getCalendarId();
  
  /**
   * Returns name of calendar service provider
   * 
   * @return name of calendar service provider
   */
  public String getServiceProvider();
  
  /**
   * Returns a summary of the event
   * 
   * @return a summary of the event
   */
  public String getSummary();
  
  /**
   * Returns event description
   * 
   * @return event description
   */
  public String getDescription();
  
  /**
   * Returns an URL associated with the event
   * 
   * @return an URL associated with the event
   */
  public String getUrl();
  
  /**
   * Returns event location data
   * 
   * @return event location data
   */
  public CalendarEventLocation getLocation();
  
  /**
   * Returns a status of this event
   * 
   * @return a status of this event
   */
  public CalendarEventStatus getStatus();
  
  /**
   * Returns list of event attendees
   * 
   * @return list of event attendees
   */
  public List<CalendarEventAttendee> getAttendees();

  /**
   * Returns event organizer
   * 
   * @return event organizer
   */
  public CalendarEventUser getOrganizer();
  
  /**
   * Returns event start time. For recurring events this is the time of the first event
   * 
   * @return event start time
   */
  public CalendarEventTemporalField getStart();
  
  /**
   * Returns event end time. For recurring events this is the end time of first event
   * 
   * @return event end time
   */
  public CalendarEventTemporalField getEnd();
  
  /**
   * Returns whether event is a all day event or not
   * 
   * @return whether event is a all day event or not
   */
  public boolean isAllDay();
  
  /**
   * Returns event creation time
   * 
   * @return event creation time
   */
  public Date getCreated();
  
  /**
   * Returns event last modification time
   * 
   * @return event last modification time
   */
  public Date getUpdated();
  
  /**
   * Returns vendor specific event properties 
   * 
   * @return vendor specific event properties 
   */
  public Map<String, String> getExtendedProperties(); 
  
  /**
   * Returns list of reminders for the event
   * 
   * @return list of reminders for the event
   */
  public List<CalendarEventReminder> getEventReminders();
  
  /**
   * Returns calendar event recurrence data or null for single events
   * 
   * @return calendar event recurrence data or null for single events
   */
  public String getRecurrence();
}