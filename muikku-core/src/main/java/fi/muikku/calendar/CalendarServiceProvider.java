package fi.muikku.calendar;

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
  
}
