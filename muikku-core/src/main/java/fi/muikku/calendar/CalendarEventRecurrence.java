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

  public void setBySecond(int[] bySecond);

  public int[] getByMinute();

  public void setByMinute(int[] byMinute);

  public int[] getByHour();

  public void setByHour(int[] byHour);

  public Set<CalendarEventRecurrenceWeekDay> getByDay();

  public void setByDay(Set<CalendarEventRecurrenceWeekDay> byDay);

  public int[] getByMonthDay();

  public void setByMonthDay(int[] byMonthDay);

  public int[] getByYearDay();

  public void setByYearDay(int[] byYearDay);

  public int[] getByWeekNo();

  public void setByWeekNo(int[] byWeekNo);

  public int[] getByMonth();

  public void setByMonth(int[] byMonth);

  public int[] getBySetPos();

  public void setBySetPos(int[] setPos);

  public CalendarEventRecurrenceWeekDay getWeekStart();

}
