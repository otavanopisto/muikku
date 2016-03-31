/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.otavanopisto.muikku.plugins.googlecalendar;

import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.EventDateTime;

import fi.otavanopisto.muikku.calendar.CalendarEventTemporalField;
import fi.otavanopisto.muikku.plugins.googlecalendar.model.GoogleCalendarEventTemporalField;

import java.util.Date;
import java.util.SimpleTimeZone;
import java.util.TimeZone;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public abstract class Convert {

  public static long minutesToMs(long minutes) {
    return DateUtils.MILLIS_PER_MINUTE * minutes;
  }

  public static long msToMinutes(long ms) {
    return ms / DateUtils.MILLIS_PER_MINUTE;
  }

  public static DateTime toDateTime(CalendarEventTemporalField d) {
    long timestamp = d.getDateTime().getTime();
    long offset = d.getTimeZone().getOffset(timestamp);
    return new DateTime(timestamp, (int) msToMinutes(offset));
  }
  
  public static CalendarEventTemporalField toCalendarEventTemporalField(EventDateTime eventDateTime) {
    return new GoogleCalendarEventTemporalField(
        toDate(eventDateTime), 
        getJavaTimeZone(eventDateTime.getTimeZone()));
  }
  
  private static TimeZone getJavaTimeZone(String timeZone) {
    if (StringUtils.isNotBlank(timeZone)) {
      return SimpleTimeZone.getTimeZone(timeZone);
    }
    // TODO: this should fallback to calendar default timezone
    return null;
  }
  
  public static Date toDate(EventDateTime dt) {
    if (dt.getDateTime() != null) {
      return toDate(dt.getDateTime());
    } else {
      return toDate(dt.getDate());
    }
  }

  public static Date toDate(DateTime dt) {
    return new Date(dt.getValue());
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

}
