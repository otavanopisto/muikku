package fi.otavanopisto.muikku.plugins.calendar.model;

import fi.otavanopisto.muikku.calendar.CalendarEventTemporalField;

import java.util.Date;
import java.util.TimeZone;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class UserCalendarEventTemporalField implements CalendarEventTemporalField {
  private final Date dateTime;
  private final TimeZone timeZone;

  public UserCalendarEventTemporalField(Date dateTime, TimeZone timeZone) {
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

}
