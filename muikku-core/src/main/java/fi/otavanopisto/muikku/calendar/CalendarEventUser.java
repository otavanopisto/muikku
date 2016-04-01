package fi.otavanopisto.muikku.calendar;

public interface CalendarEventUser {
 
  /**
   * Returns display name of the event user
   * 
   * @return display name of the event user
   */
  public String getDisplayName();

  /**
   * Returns email of the event user
   * 
   * Email acts as an identifier of the user so the property is mandatory
   * 
   * @return email of the event user
   */
  public String getEmail();

}
