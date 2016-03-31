package fi.otavanopisto.muikku.calendar;

import java.util.Date;
import java.util.TimeZone;

public interface CalendarEventTemporalField {

  /**
   * Returns temporal field date time
   * 
   * @return temporal field date time
   */
  public Date getDateTime();
  
  /**
   * Returns temporal field time zone
   * 
   * @return temporal field time zone
   */
  public TimeZone getTimeZone();
  
}
