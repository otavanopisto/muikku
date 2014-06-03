package fi.muikku.calendar;

public interface CalendarEventLocation {

  /**
   * Returns a free-form location for the event
   * 
   * @return
   */
  public String getLocation();
  
  /**
   * Returns video call link for the event if available
   * 
   * @return video call link for the event
   */
  public String getVideoCallLink();
  
}
