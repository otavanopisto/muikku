package fi.muikku.calendar;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class DefaultCalendarEvent implements CalendarEvent {
  
  public DefaultCalendarEvent() {
  }

  public DefaultCalendarEvent(String id, String calendarId, String serviceProvider, String summary, String description, CalendarEventStatus status,
      List<CalendarEventAttendee> attendees, CalendarEventUser organizer, CalendarEventTemporalField start, CalendarEventTemporalField end, Date created,
      Date updated, Map<String, String> extendedProperties, List<CalendarEventReminder> reminders, CalendarEventRecurrence recurrence) {
    this.id = id;
    this.calendarId = calendarId;
    this.serviceProvider = serviceProvider;
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
    return serviceProvider;
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

  private String id;
  private String calendarId;
  private String serviceProvider;
  private String summary;
  private String description;
  private CalendarEventStatus status;
  private List<CalendarEventAttendee> attendees;
  private CalendarEventUser organizer;
  private CalendarEventTemporalField start;
  private CalendarEventTemporalField end;
  private Date created;
  private Date updated;
  private Map<String, String> extendedProperties;
  private List<CalendarEventReminder> reminders;
  private CalendarEventRecurrence recurrence;
}
