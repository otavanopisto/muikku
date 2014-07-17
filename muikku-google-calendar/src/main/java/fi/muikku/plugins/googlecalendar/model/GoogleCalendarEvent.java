/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar.model;

import com.google.api.services.calendar.model.Event;
import fi.muikku.calendar.CalendarEvent;
import fi.muikku.calendar.CalendarEventAttendee;
import fi.muikku.calendar.CalendarEventLocation;
import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventReminder;
import fi.muikku.calendar.CalendarEventStatus;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarEventUser;
import fi.muikku.calendar.DefaultCalendarEventLocation;
import fi.muikku.plugins.googlecalendar.Convert;
import fi.muikku.plugins.googlecalendar.model.GoogleCalendarEventTemporalField;
import fi.muikku.plugins.googlecalendar.model.GoogleCalendarEventUser;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.SimpleTimeZone;
import java.util.TimeZone;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEvent implements CalendarEvent {
  private final String id;
  private final String calendarId;
  private final String summary;
  private final String description;
  private final CalendarEventStatus status;
  private final List<CalendarEventAttendee> attendees;
  private final CalendarEventUser organizer;
  private final CalendarEventTemporalField start;
  private final CalendarEventTemporalField end;
  private final Date created;
  private final Date updated;
  private final Map<String, String> extendedProperties;
  private final List<CalendarEventReminder> reminders;
  private final CalendarEventRecurrence recurrence;
  private final String url;
  private final CalendarEventLocation location;
  private final boolean allDay;

  public GoogleCalendarEvent(String id, String calendarId, String summary, String description, CalendarEventStatus status, List<CalendarEventAttendee> attendees, CalendarEventUser organizer, CalendarEventTemporalField start, CalendarEventTemporalField end, Date created, Date updated, Map<String, String> extendedProperties, List<CalendarEventReminder> reminders, CalendarEventRecurrence recurrence, String url, CalendarEventLocation location, boolean allDay) {
    this.id = id;
    this.calendarId = calendarId;
    this.summary = summary;
    this.description = description;
    this.status = status;
    this.attendees = attendees;
    this.organizer = organizer;
    this.start = start;
    this.end = end;
    this.created = created;
    this.updated = updated;
    this.extendedProperties = extendedProperties;
    this.reminders = reminders;
    this.recurrence = recurrence;
    this.url = url;
    this.location = location;
    this.allDay = allDay;
  }

  public GoogleCalendarEvent(Event event, String calendarId) {
    this(event.getId(), calendarId, event.getSummary(), event.getDescription(), CalendarEventStatus.valueOf(event.getStatus().toUpperCase(Locale.ROOT)), null, new GoogleCalendarEventUser(event.getOrganizer().getDisplayName(), event.getOrganizer().getEmail()), new GoogleCalendarEventTemporalField(Convert.toDate(event.getStart()), getJavaTimeZone(event.getStart().getTimeZone())), new GoogleCalendarEventTemporalField(Convert.toDate(event.getEnd()), getJavaTimeZone(event.getEnd().getTimeZone())), new Date(event.getCreated().getValue()), new Date(event.getUpdated().getValue()), new HashMap<String, String>(), null, null, event.getHtmlLink(), new DefaultCalendarEventLocation(event.getLocation(), event.getHangoutLink(), null, null), event.getStart().getDate() != null);
  }

  private static TimeZone getJavaTimeZone(String timeZone) {
    if (StringUtils.isNotBlank(timeZone)) {
      return SimpleTimeZone.getTimeZone(timeZone);
    }
    // TODO: this should fallback to calendar default timezone
    return null;
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getCalendarId() {
    return calendarId;
  }

  @Override
  public String getServiceProvider() {
    return "google";
  }

  @Override
  public String getSummary() {
    return summary;
  }

  @Override
  public String getDescription() {
    return description;
  }

  @Override
  public CalendarEventStatus getStatus() {
    return status;
  }

  @Override
  public List<CalendarEventAttendee> getAttendees() {
    return attendees;
  }

  @Override
  public CalendarEventUser getOrganizer() {
    return organizer;
  }

  @Override
  public CalendarEventTemporalField getStart() {
    return start;
  }

  @Override
  public CalendarEventTemporalField getEnd() {
    return end;
  }

  @Override
  public Date getCreated() {
    return created;
  }

  @Override
  public Date getUpdated() {
    return updated;
  }

  @Override
  public Map<String, String> getExtendedProperties() {
    return extendedProperties;
  }

  @Override
  public List<CalendarEventReminder> getEventReminders() {
    return reminders;
  }

  @Override
  public CalendarEventRecurrence getRecurrence() {
    return recurrence;
  }

  @Override
  public String getUrl() {
    return url;
  }

  @Override
  public CalendarEventLocation getLocation() {
    return location;
  }

  @Override
  public boolean isAllDay() {
    return allDay;
  }

}
