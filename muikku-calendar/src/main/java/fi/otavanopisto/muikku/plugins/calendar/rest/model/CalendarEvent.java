package fi.otavanopisto.muikku.plugins.calendar.rest.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import fi.otavanopisto.muikku.calendar.CalendarEventStatus;

public class CalendarEvent {
  
  public CalendarEvent() {
  }

  public CalendarEvent(Long calendarId, String id, String summary, String description, String url, String location, 
      String videoCallLink, BigDecimal longitude, BigDecimal latitude, CalendarEventStatus status, Date start, TimeZone startTimeZone, Date end,
      TimeZone endTimeZone, boolean allDay, Date created, Date updated, Map<String, String> extendedProperties, List<CalendarEventAttendee> attendees,
      List<CalendarEventReminder> reminders, String recurrence) {
    this.calendarId = calendarId;
    this.id = id;
    this.summary = summary;
    this.description = description;
    this.url = url;
    this.location = location;
    this.videoCallLink = videoCallLink;
    this.longitude = longitude;
    this.latitude = latitude;
    this.status = status;
    this.start = start;
    this.startTimeZone = startTimeZone;
    this.end = end;
    this.endTimeZone = endTimeZone;
    this.allDay = allDay;
    this.created = created;
    this.updated = updated;
    this.extendedProperties = extendedProperties;
    this.attendees = attendees;
    this.reminders = reminders;
    this.recurrence = recurrence;
  }

  public Long getCalendarId() {
    return calendarId;
  }

  public void setCalendarId(Long calendarId) {
    this.calendarId = calendarId;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }
  
  public String getUrl() {
    return url;
  }
  
  public void setUrl(String url) {
    this.url = url;
  }
  
  public String getLocation() {
    return location;
  }
  
  public void setLocation(String location) {
    this.location = location;
  }
  
  public String getVideoCallLink() {
    return videoCallLink;
  }
  
  public void setVideoCallLink(String videoCallLink) {
    this.videoCallLink = videoCallLink;
  }
  
  public BigDecimal getLatitude() {
    return latitude;
  }
  
  public void setLatitude(BigDecimal latitude) {
    this.latitude = latitude;
  }
  
  public BigDecimal getLongitude() {
    return longitude;
  }
  
  public void setLongitude(BigDecimal longitude) {
    this.longitude = longitude;
  }

  public CalendarEventStatus getStatus() {
    return status;
  }

  public void setStatus(CalendarEventStatus status) {
    this.status = status;
  }

  public Date getStart() {
    return start;
  }

  public void setStart(Date start) {
    this.start = start;
  }

  public TimeZone getStartTimeZone() {
    return startTimeZone;
  }

  public void setStartTimeZone(TimeZone startTimeZone) {
    this.startTimeZone = startTimeZone;
  }

  public Date getEnd() {
    return end;
  }

  public void setEnd(Date end) {
    this.end = end;
  }

  public TimeZone getEndTimeZone() {
    return endTimeZone;
  }

  public void setEndTimeZone(TimeZone endTimeZone) {
    this.endTimeZone = endTimeZone;
  }
  
  public boolean isAllDay() {
    return allDay;
  }
  
  public void setAllDay(boolean allDay) {
    this.allDay = allDay;
  }

  public Date getCreated() {
    return created;
  }

  public void setCreated(Date created) {
    this.created = created;
  }

  public Date getUpdated() {
    return updated;
  }

  public void setUpdated(Date updated) {
    this.updated = updated;
  }

  public Map<String, String> getExtendedProperties() {
    return extendedProperties;
  }

  public void setExtendedProperties(Map<String, String> extendedProperties) {
    this.extendedProperties = extendedProperties;
  }

  public List<CalendarEventAttendee> getAttendees() {
    return attendees;
  }

  public void setAttendees(List<CalendarEventAttendee> attendees) {
    this.attendees = attendees;
  }

  public List<CalendarEventReminder> getReminders() {
    return reminders;
  }

  public void setReminders(List<CalendarEventReminder> reminders) {
    this.reminders = reminders;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getRecurrence() {
    return recurrence;
  }

  public void setRecurrence(String recurrence) {
    this.recurrence = recurrence;
  }

  private Long calendarId;
  private String id;
  private String summary;
  private String description;
  private String url;
  private String location;
  private String videoCallLink;
  private BigDecimal longitude;
  private BigDecimal latitude;
  private CalendarEventStatus status;
  private Date start;
  private TimeZone startTimeZone;
  private Date end;
  private TimeZone endTimeZone;
  private boolean allDay;
  private Date created;
  private Date updated;
  private Map<String, String> extendedProperties;
  private List<CalendarEventAttendee> attendees;
  private List<CalendarEventReminder> reminders;
  private String recurrence;
}
