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
