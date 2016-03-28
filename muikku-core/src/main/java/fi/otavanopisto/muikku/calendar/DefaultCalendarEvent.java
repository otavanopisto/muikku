package fi.otavanopisto.muikku.calendar;

import java.util.Date;
import java.util.List;
import java.util.Map;

public class DefaultCalendarEvent implements CalendarEvent {
  
  public DefaultCalendarEvent() {
  }

  public DefaultCalendarEvent(String id, String calendarId, String serviceProvider, String summary, String description, String url, CalendarEventLocation location, 
      CalendarEventStatus status, List<CalendarEventAttendee> attendees, CalendarEventUser organizer, CalendarEventTemporalField start, CalendarEventTemporalField end, 
      boolean allDay, Date created, Date updated, Map<String, String> extendedProperties, List<CalendarEventReminder> reminders, String recurrence) {
    this.id = id;
    this.calendarId = calendarId;
    this.serviceProvider = serviceProvider;
    this.summary = summary;
    this.description = description;
    this.url = url;
    this.location = location;
    this.status = status;
    this.attendees = attendees;
    this.organizer = organizer;
    this.start = start;
    this.end = end;
    this.allDay = allDay;
    this.created = created;
    this.updated = updated;
    this.extendedProperties = extendedProperties;
    this.recurrence = recurrence;
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
  public String getUrl() {
    return url;
  }
  
  @Override
  public CalendarEventLocation getLocation() {
    return location;
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
  public boolean isAllDay() {
    return allDay;
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
  public String getRecurrence() {
    return recurrence;
  }

  private String id;
  private String calendarId;
  private String serviceProvider;
  private String summary;
  private String description;
  private CalendarEventLocation location;
  private String url;
  private CalendarEventStatus status;
  private List<CalendarEventAttendee> attendees;
  private CalendarEventUser organizer;
  private CalendarEventTemporalField start;
  private CalendarEventTemporalField end;
  private boolean allDay;
  private Date created;
  private Date updated;
  private Map<String, String> extendedProperties;
  private List<CalendarEventReminder> reminders;
  private String recurrence;
}
