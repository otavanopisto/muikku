package fi.otavanopisto.muikku.calendar;

public interface CalendarEventReminder {

  /**
   * Returns a type of the reminder
   * 
   * @return a type of the reminder
   */
  public CalendarEventReminderType getType();
  
  /**
   * Returns a number of minutes before the start of the event the reminder will trigger.
   * 
   * @return a number of minutes before the start of the event the reminder will trigger.
   */
  public Integer getMinutesBefore();
  
}
