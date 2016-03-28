package fi.otavanopisto.muikku.calendar;

import java.math.BigDecimal;

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
  
  /**
   * Returns event geolocation longitude
   * 
   * @return event geolocation longitude
   */
  public BigDecimal getLongitude();
  
  /**
   * Returns event geolocation latitude
   * 
   * @return event geolocation latitude
   */
  public BigDecimal getLatitude();
  
}
