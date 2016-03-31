package fi.otavanopisto.muikku.calendar;

public class DefaultCalendarEventReminder implements CalendarEventReminder {

  public DefaultCalendarEventReminder() {
  }
  
  public DefaultCalendarEventReminder(Integer minutesBefore, CalendarEventReminderType type) {
    super();
    this.minutesBefore = minutesBefore;
    this.type = type;
  }

  @Override
  public CalendarEventReminderType getType() {
    return type;
  }

  @Override
  public Integer getMinutesBefore() {
    return minutesBefore;
  }

  private Integer minutesBefore;
  private CalendarEventReminderType type;
}
