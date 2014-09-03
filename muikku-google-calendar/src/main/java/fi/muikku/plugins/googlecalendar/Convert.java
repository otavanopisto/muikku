/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.EventDateTime;
import fi.muikku.calendar.CalendarEventTemporalField;
import java.util.Date;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public abstract class Convert {

  public static long minutesToMs(long minutes) {
    return minutes * (60 * 60 * 1000);
  }

  public static DateTime toDateTime(CalendarEventTemporalField d) {
    long timestamp = d.getDateTime().getTime();
    long offset = d.getTimeZone().getOffset(timestamp);
    return new DateTime(timestamp + offset, (int) msToMinutes(offset));
  }

  public static Date toDate(EventDateTime dt) {
    if (dt.getDateTime() != null) {
      return toDate(dt.getDateTime());
    } else {
      return toDate(dt.getDate());
    }
  }

  public static Date toDate(DateTime dt) {
    return new Date(dt.getValue() - minutesToMs(dt.getTimeZoneShift()));
  }

  static EventDateTime toEventDateTime(boolean dateOnly, CalendarEventTemporalField datetime) {
    EventDateTime result = new EventDateTime();
    result.setTimeZone(datetime.getTimeZone().getID());
    if (dateOnly) {
      long timestamp = datetime.getDateTime().getTime();
      long offset = datetime.getTimeZone().getOffset(timestamp);
      result.setDate(new DateTime(true, timestamp + offset, (int) msToMinutes(offset)));
    } else {
      result.setDateTime(toDateTime(datetime));
    }
    return result;
  }

  public static long msToMinutes(long ms) {
    return ms / (60 * 60 * 1000);
  }

}
