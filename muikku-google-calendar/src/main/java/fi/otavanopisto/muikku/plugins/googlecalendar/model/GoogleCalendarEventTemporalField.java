/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.otavanopisto.muikku.plugins.googlecalendar.model;

import fi.otavanopisto.muikku.calendar.CalendarEventTemporalField;

import java.util.Date;
import java.util.TimeZone;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEventTemporalField implements CalendarEventTemporalField {
  private final Date dateTime;
  private final TimeZone timeZone;

  public GoogleCalendarEventTemporalField(Date dateTime, TimeZone timeZone) {
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
