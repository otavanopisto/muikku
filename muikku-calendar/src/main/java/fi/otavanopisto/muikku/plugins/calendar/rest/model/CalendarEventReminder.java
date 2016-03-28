package fi.otavanopisto.muikku.plugins.calendar.rest.model;

import fi.otavanopisto.muikku.calendar.CalendarEventReminderType;

public class CalendarEventReminder {

  public CalendarEventReminder() {
  }
  
  public CalendarEventReminder(CalendarEventReminderType type, Integer minutesBefore) {
    this.type = type;
    this.minutesBefore = minutesBefore;
  }

  public CalendarEventReminderType getType() {
    return type;
  }

  public void setType(CalendarEventReminderType type) {
    this.type = type;
  }

  public Integer getMinutesBefore() {
    return minutesBefore;
  }

  public void setMinutesBefore(Integer minutesBefore) {
    this.minutesBefore = minutesBefore;
  }

  private CalendarEventReminderType type;
  private Integer minutesBefore;
}
