package fi.otavanopisto.muikku.calendar;

import java.util.Date;
import java.util.TimeZone;

public class DefaultCalendarEventTemporalField implements CalendarEventTemporalField {
  
  public DefaultCalendarEventTemporalField() {
  }
  
  public DefaultCalendarEventTemporalField(Date dateTime, TimeZone timeZone) {
    super();
    this.dateTime = dateTime;
    this.timeZone = timeZone;
  }

  @Override
  public Date getDateTime() {
    return dateTime;
  }

  @Override
  public TimeZone getTimeZone() {
    return timeZone;
  }

  private Date dateTime;
  private TimeZone timeZone;
}
