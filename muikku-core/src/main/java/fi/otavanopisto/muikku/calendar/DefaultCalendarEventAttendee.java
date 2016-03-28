package fi.otavanopisto.muikku.calendar;

public class DefaultCalendarEventAttendee implements CalendarEventAttendee {
  
  public DefaultCalendarEventAttendee() {
  }
  
  public DefaultCalendarEventAttendee(String comment, String email, String displayName, CalendarEventAttendeeStatus status) {
    super();
    this.comment = comment;
    this.email = email;
    this.displayName = displayName;
    this.status = status;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }

  @Override
  public String getEmail() {
    return email;
  }

  @Override
  public CalendarEventAttendeeStatus getStatus() {
    return status;
  }

  @Override
  public String getComment() {
    return comment;
  }

  private String comment;
  private String email;
  private String displayName;
  private CalendarEventAttendeeStatus status;
}
