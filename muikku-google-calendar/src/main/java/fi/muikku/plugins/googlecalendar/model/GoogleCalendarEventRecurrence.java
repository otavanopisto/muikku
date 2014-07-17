/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar.model;

import fi.muikku.calendar.CalendarEventRecurrence;
import fi.muikku.calendar.CalendarEventRecurrenceFrequency;
import fi.muikku.calendar.CalendarEventRecurrenceWeekDay;
import fi.muikku.calendar.CalendarEventTemporalField;
import fi.muikku.calendar.CalendarServiceException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.TimeZone;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEventRecurrence implements CalendarEventRecurrence {
  private TimeZone timeZone;
  private Locale locale;
  private CalendarEventRecurrenceFrequency frequency;
  private Integer interval;
  private CalendarEventTemporalField until;
  private Integer count;

  private int[] bySecond;
  private int[] byMinute;
  private int[] byHour;
  private Set<CalendarEventRecurrenceWeekDay> byDay;
  private int[] byMonthDay;
  private int[] byYearDay;
  private int[] byWeekNo;
  private int[] byMonth;
  private int[] bySetPos;

  {
    this.bySecond = new int[] {};
    this.byMinute = new int[] {};
    this.byHour = new int[] {};
    this.byDay = Collections.emptySet();
    this.byMonthDay = new int[] {};
    this.byYearDay = new int[] {};
    this.byWeekNo = new int[] {};
    this.byMonth = new int[] {};
    this.bySetPos = new int[] {};
  }

  public GoogleCalendarEventRecurrence(CalendarEventRecurrenceFrequency frequency, Integer interval, CalendarEventTemporalField until, TimeZone timeZone, Locale locale) {
    this.timeZone = timeZone;
    this.locale = locale;

    this.frequency = frequency;
    this.interval = interval;
    this.until = until;
  }

  public GoogleCalendarEventRecurrence(CalendarEventRecurrenceFrequency frequency, Integer interval, Integer count, TimeZone timeZone, Locale locale) {
    this.timeZone = timeZone;
    this.locale = locale;

    this.frequency = frequency;
    this.interval = interval;
    this.count = count;
  }

  public GoogleCalendarEventRecurrence(String icalRecurrence, TimeZone timeZone, Locale locale) throws CalendarServiceException {
    throw new UnsupportedOperationException();
  }

  @Override
  public CalendarEventRecurrenceWeekDay getWeekStart() {
    return toRecurrenceWeekDay(java.util.Calendar.getInstance(getLocale()).getFirstDayOfWeek());
  }

  @Override
  public CalendarEventRecurrenceFrequency getFrequency() {
    return frequency;
  }

  @Override
  public Integer getCount() {
    return count;
  }

  @Override
  public Integer getInterval() {
    return interval;
  }

  @Override
  public CalendarEventTemporalField getUntil() {
    return until;
  }

  private static CalendarEventRecurrenceWeekDay toRecurrenceWeekDay(int calendarDay) {
    switch (calendarDay) {
      case java.util.Calendar.MONDAY:
        return CalendarEventRecurrenceWeekDay.MONDAY;
      case java.util.Calendar.TUESDAY:
        return CalendarEventRecurrenceWeekDay.TUESDAY;
      case java.util.Calendar.WEDNESDAY:
        return CalendarEventRecurrenceWeekDay.WEDNESDAY;
      case java.util.Calendar.THURSDAY:
        return CalendarEventRecurrenceWeekDay.THURSDAY;
      case java.util.Calendar.FRIDAY:
        return CalendarEventRecurrenceWeekDay.FRIDAY;
      case java.util.Calendar.SATURDAY:
        return CalendarEventRecurrenceWeekDay.SATURDAY;
      case java.util.Calendar.SUNDAY:
        return CalendarEventRecurrenceWeekDay.SUNDAY;
      default:
        throw new RuntimeException("Day of week not a weekday");
    }
  }

  private static int toCalendarDay(CalendarEventRecurrenceWeekDay recurrenceWeekDay) {
    switch (recurrenceWeekDay) {
      case MONDAY:
        return java.util.Calendar.MONDAY;
      case TUESDAY:
        return java.util.Calendar.TUESDAY;
      case WEDNESDAY:
        return java.util.Calendar.WEDNESDAY;
      case THURSDAY:
        return java.util.Calendar.THURSDAY;
      case FRIDAY:
        return java.util.Calendar.FRIDAY;
      case SATURDAY:
        return java.util.Calendar.SATURDAY;
      case SUNDAY:
        return java.util.Calendar.SUNDAY;
      default:
        throw new RuntimeException("Day of week not a weekday");
    }
  }

  public TimeZone getTimeZone() {
    return timeZone;
  }

  public void setTimeZone(TimeZone timeZone) {
    this.timeZone = timeZone;
  }

  public Locale getLocale() {
    return locale;
  }

  public void setLocale(Locale locale) {
    this.locale = locale;
  }

  @Override
  public int[] getBySecond() {
    return bySecond;
  }

  @Override
  public void setBySecond(int[] bySecond) {
    this.bySecond = bySecond;
  }

  @Override
  public int[] getByMinute() {
    return byMinute;
  }

  @Override
  public void setByMinute(int[] byMinute) {
    this.byMinute = byMinute;
  }

  @Override
  public int[] getByHour() {
    return byHour;
  }

  @Override
  public void setByHour(int[] byHour) {
    this.byHour = byHour;
  }

  @Override
  public Set<CalendarEventRecurrenceWeekDay> getByDay() {
    return Collections.unmodifiableSet(this.byDay);
  }

  @Override
  public void setByDay(Set<CalendarEventRecurrenceWeekDay> byDay) {
    this.byDay = new HashSet<>(byDay);
  }

  @Override
  public int[] getByMonthDay() {
    return byMonthDay;
  }

  @Override
  public void setByMonthDay(int[] byMonthDay) {
    this.byMonthDay = byMonthDay;
  }

  @Override
  public int[] getByYearDay() {
    return byYearDay;
  }

  @Override
  public void setByYearDay(int[] byYearDay) {
    this.byYearDay = byYearDay;
  }

  @Override
  public int[] getByWeekNo() {
    return byWeekNo;
  }

  @Override
  public void setByWeekNo(int[] byWeekNo) {
    this.byWeekNo = byWeekNo;
  }

  @Override
  public int[] getByMonth() {
    return byMonth;
  }

  @Override
  public void setByMonth(int[] byMonth) {
    this.byMonth = byMonth;
  }

  @Override
  public int[] getBySetPos() {
    return bySetPos;
  }

  @Override
  public void setBySetPos(int[] bySetPos) {
    this.bySetPos = bySetPos;
  }

}
