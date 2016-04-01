package fi.otavanopisto.muikku.plugins.calendar.rest.model;

import fi.otavanopisto.muikku.calendar.CalendarEventAttendeeStatus;

public class CalendarEventAttendee {
  
  public CalendarEventAttendee() {
  }

  public CalendarEventAttendee(String email, String displayName, CalendarEventAttendeeStatus status, String comment) {
    this.email = email;
    this.displayName = displayName;
    this.status = status;
    this.comment = comment;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public CalendarEventAttendeeStatus getStatus() {
    return status;
  }

  public void setStatus(CalendarEventAttendeeStatus status) {
    this.status = status;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  private String email;

  private String displayName;

  private CalendarEventAttendeeStatus status;

  private String comment;
}
