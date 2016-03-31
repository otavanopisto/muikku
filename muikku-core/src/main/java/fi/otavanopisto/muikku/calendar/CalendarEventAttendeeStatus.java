package fi.otavanopisto.muikku.calendar;

public enum CalendarEventAttendeeStatus {
  
  /**
   * Attendee has not responded to the invitation
   */
  
  UNKNOWN,
  
  /**
   * Attendee has declined the event invitation
   */
  
  DECLINED,
  
  /**
   * Attendee has tentatively accepted the event invitation
   */
  
  TENTATIVE,
  
  /**
   * Attendee has accepted the event invitation
   */
  
  ACCEPTED
  
}
