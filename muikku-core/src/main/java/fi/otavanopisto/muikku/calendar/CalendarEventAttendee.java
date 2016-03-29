package fi.otavanopisto.muikku.calendar;

public interface CalendarEventAttendee extends CalendarEventUser {

  /**
   * Returns attendee invitation status
   * 
   * @return attendee invitation status
   */
  public CalendarEventAttendeeStatus getStatus();
  
  /**
   * Returns attendee comment
   * 
   * @return attendee comment
   */
  public String getComment();

}
