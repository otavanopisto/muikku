/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar;

import fi.muikku.calendar.CalendarEventRecurrenceFrequency;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEventRecurrenceParser {

  public static class ParseResult<T> {
    public final T result;
    public final String rest;

    public ParseResult(T result, String rest) {
      this.result = result;
      this.rest = rest;
    }

    public boolean isSuccess() {
      return result != null;
    }
  }

  private static final String RE_DATE =
          "(?<year>\\d{4})"
          + "(?<month>\\d{2})"
          + "(?<day>\\d{2})";
  private static final String RE_TIME =
          "(?<hour>\\d{2})"
          + "(?<minute>\\d{2})"
          + "(?<second>\\d{2})"
          + "(?<utc>Z{0,1})";
  private static final String RE_DATETIME =
          RE_DATE + "T" + RE_TIME;
  private static final String RE_UTC_OFFSET =
          "(?<offset_sign>\\+|-)"
          + "(?<offset_hour>\\d{2})"
          + "(?<offset_minute>\\d{2})"
          + "(?<offset_second>\\d{0,2})";
  private static final String RE_NUMBER_LIST ="((?:\\d+,?)+)";

  private static final String RE_RECUR_FREQ =
    "FREQ=(SECONDLY|MINUTELY|HOURLY|DAILY|WEEKLY|MONTHLY|YEARLY)";

  private static final String[] RE_RECUR_RULES = {
    "UNTIL=((?<date>" + RE_DATE + ")|(?<datetime>" + RE_DATETIME + "))",
    "COUNT=(\\d+)",
    "INTERVAL=(\\d+)",
    "BYSECOND=" + RE_NUMBER_LIST,
    "BYMINUTE=" + RE_NUMBER_LIST,
    "BYHOUR=" + RE_NUMBER_LIST,
    "BYDAY=(MO|TU|WE|TH|FR|SA|SU)",
    "BYMONTHDAY=" + RE_NUMBER_LIST,
    "BYYEARDAY=" + RE_NUMBER_LIST,
    "BYWEEKNO=" + RE_NUMBER_LIST,
    "BYMONTH=" + RE_NUMBER_LIST,
    "BYSETPOS=" + RE_NUMBER_LIST
  };

  public static ParseResult<Date> parseDate(String date) {
    Matcher matcher = Pattern.compile("^" + RE_DATE).matcher(date);
    if (!matcher.find()) {
      return new ParseResult<>(null, date);
    }
    int year = Integer.parseInt(matcher.group("year"));
    int month = Integer.parseInt(matcher.group("month"));
    int day = Integer.parseInt(matcher.group("day"));
    Calendar cal = Calendar.getInstance();
    cal.clear();
    cal.set(year, month, day);
    return new ParseResult<>(cal.getTime(), date.substring(matcher.end()));
  }

  public static ParseResult<Date> parseDateTime(String dateTime) {
    Matcher matcher = Pattern.compile("^" + RE_DATETIME).matcher(dateTime);
    if (!matcher.find()) {
      return new ParseResult<>(null, dateTime);
    }
    int year = Integer.parseInt(matcher.group("year"));
    int month = Integer.parseInt(matcher.group("month"));
    int day = Integer.parseInt(matcher.group("day"));
    int hour = Integer.parseInt(matcher.group("hour"));
    int minute = Integer.parseInt(matcher.group("minute"));
    int second = Integer.parseInt(matcher.group("second"));
    Calendar cal = Calendar.getInstance();
    cal.clear();
    cal.set(year, month, day, hour, minute, second);
    return new ParseResult<>(cal.getTime(), dateTime.substring(matcher.end()));
  }

  public static ParseResult<CalendarEventRecurrenceFrequency> parseFreqRule(String rule) {
    Matcher matcher = Pattern.compile("^" + RE_RECUR_FREQ).matcher(rule);
    if (!matcher.find()) {
      return new ParseResult<>(null, rule);
    }
    return new ParseResult<>(
            CalendarEventRecurrenceFrequency.valueOf(matcher.group(1)),
            rule.substring(matcher.end()));
  }
}
