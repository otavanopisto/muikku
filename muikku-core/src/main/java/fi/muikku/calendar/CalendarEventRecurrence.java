package fi.muikku.calendar;

import java.util.Set;

public interface CalendarEventRecurrence {

  /**
   * Returns event recurrence frequency
   *
   * @return Returns event recurrence frequency
   */
  public CalendarEventRecurrenceFrequency getFrequency();

  /**
   * Returns event recurrence frequency or null if not specified
   *
   * @return event recurrence frequency or null if not specified
   */
  public Integer getCount();

  /**
   * Returns event recurrence interval or null if not specified
   *
   * @return event recurrence interval or null if not specified
   */
  public Integer getInterval();

  /**
   * Returns point in time when the event recurring ends or null if not specified
   *
   * @return point in time when the event recurring ends or null if not specified
   */
  public CalendarEventTemporalField getUntil();

  public int[] getBySecond();

  public int[] getByMinute();

  public int[] getByHour();

  public Set<CalendarEventRecurrenceWeekDay> getByDay();

  public int[] getByMonthDay();

  public int[] getByYearDay();

  public int[] getByWeekNo();

  public int[] getByMonth();

  public int[] getBySetPos();

  public CalendarEventRecurrenceWeekDay getWeekStart();
  
  public String toIcalRRule();

}
