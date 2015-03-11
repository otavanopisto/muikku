/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.calendar;

import fi.muikku.calendar.CalendarEventRecurrenceFrequency;
import fi.muikku.calendar.CalendarEventRecurrenceWeekDay;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class CalendarEventRecurrenceParser {

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

  public static class NumberListRule {
    public final String name;
    public final int[] values;

    public NumberListRule(String name, int[] values) {
      this.name = name;
      this.values = values;
    }
  }

  public static class NumberRule {
    public final String name;
    public final int value;

    public NumberRule(String name, int value) {
      this.name = name;
      this.value = value;
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

  private static final String RE_NUMBER = "(\\d+)";

  private static final String RE_RECUR_FREQ =
    "FREQ=(SECONDLY|MINUTELY|HOURLY|DAILY|WEEKLY|MONTHLY|YEARLY)";

  private static final String RE_RECUR_BYDAY =
    "BYDAY=((?:(?:MO|TU|WE|TH|FR|SA|SU),?)+)";

  private static final String RE_RECUR_UNTIL =
    "UNTIL=((?<date>" + RE_DATE + ")|(?<datetime>" + RE_DATETIME + "))";

  private static final String RE_RECUR_NUMLIST_RULE_NAME =
    "(BYSECOND|BYMINUTE|BYHOUR|BYMONTHDAY|BYYEARDAY|BYWEEKNO|BYMONTH|BYSETPOS)";

  private static final String RE_RECUR_NUM_RULE_NAME =
    "(COUNT|INTERVAL)";

  private static final String RE_RECUR_NUMLIST_RULE =
    RE_RECUR_NUMLIST_RULE_NAME + "=" + RE_NUMBER_LIST;

  private static final String RE_RECUR_NUM_RULE =
    RE_RECUR_NUM_RULE_NAME + RE_NUMBER;

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

  public static ParseResult<HashSet<CalendarEventRecurrenceWeekDay>> parseByDayRule(String rule) {
    Matcher matcher = Pattern.compile("^" + RE_RECUR_BYDAY).matcher(rule);
    HashSet<CalendarEventRecurrenceWeekDay> result = new HashSet<>();
    if (!matcher.find()) {
      return new ParseResult<>(null, rule);
    }
    String rest = rule.substring(matcher.end());
    for (String wd : matcher.group(1).split(",")) {
      switch (wd) {
        case "MO":
          result.add(CalendarEventRecurrenceWeekDay.MONDAY);
          break;
        case "TU":
          result.add(CalendarEventRecurrenceWeekDay.TUESDAY);
          break;
        case "WE":
          result.add(CalendarEventRecurrenceWeekDay.WEDNESDAY);
          break;
        case "TH":
          result.add(CalendarEventRecurrenceWeekDay.THURSDAY);
          break;
        case "FR":
          result.add(CalendarEventRecurrenceWeekDay.FRIDAY);
          break;
        case "SA":
          result.add(CalendarEventRecurrenceWeekDay.SATURDAY);
          break;
        case "SU":
          result.add(CalendarEventRecurrenceWeekDay.SUNDAY);
          break;
        default:
      }
    }
    return new ParseResult<>(result, rule.substring(matcher.end()));
  }

  public static ParseResult<Date> parseUntilRule(String rule) {
    Matcher matcher = Pattern.compile("^" + RE_DATE).matcher(rule);
    if (!matcher.find()) {
      return new ParseResult<>(null, rule);
    }
    if (!"".equals(matcher.group("date"))) {
      return new ParseResult<>(parseDate(matcher.group("date")).result,
                               rule.substring(matcher.end()));
    } else {
      return new ParseResult<>(parseDateTime(matcher.group("datetime")).result,
                               rule.substring(matcher.end()));
    }
  }

  public static ParseResult<NumberListRule> parseNumberListRule(String rule) {
    Matcher matcher = Pattern.compile("^" + RE_RECUR_NUMLIST_RULE).matcher(rule);
    if (!matcher.find()) {
      return new ParseResult<>(null, rule);
    }
    String[] numbers = matcher.group(2).split(",");
    int[] values = new int[numbers.length];
    for (int i=0; i<numbers.length; i++) {
      values[i] = Integer.parseInt(numbers[i]);
    }

    return new ParseResult<>(
            new NumberListRule(matcher.group(1), values),
            rule.substring(matcher.end()));
  }

  public static ParseResult<NumberRule> parseNumberRule(String rule) {
    Matcher matcher = Pattern.compile("^" + RE_RECUR_NUM_RULE).matcher(rule);
    if (!matcher.find()) {
      return new ParseResult<>(null, rule);
    }

    return new ParseResult<>(
            new NumberRule(matcher.group(1), Integer.parseInt(matcher.group(2))),
            rule.substring(matcher.end()));
  }

  public static String[] splitRuleParts(String rrule) {
    return rrule.split(":", 2)[1].split(";");
  }

  public static CalendarEventRecurrenceFrequency findFrequency(String rrule) {
    for (String part : splitRuleParts(rrule)) {
      ParseResult<CalendarEventRecurrenceFrequency> result =
              parseFreqRule(part);
      if (result.result != null) {
        return result.result;
      }
    }
    return null;
  }

  public static Date findUntil(String rrule) {
    for (String part : splitRuleParts(rrule)) {
      ParseResult<Date> result = parseUntilRule(part);
      if (result.result != null) {
        return result.result;
      }
    }

    return null;
  }

  public static Set<CalendarEventRecurrenceWeekDay> findByWeekDay(String rrule) {
    for (String part : splitRuleParts(rrule)) {
      ParseResult<HashSet<CalendarEventRecurrenceWeekDay>> result = parseByDayRule(part);
      if (result.result != null) {
        return result.result;
      }
    }

    return new HashSet<>();
  }

  public static int[] findNumberListRule(String ruleName, String rrule) {
    for (String part : splitRuleParts(rrule)) {
      ParseResult<NumberListRule> result = parseNumberListRule(part);
      if (result.result != null && result.result.name.equals(ruleName)) {
        return result.result.values;
      }
    }
    return new int[] {};
  }

  public static int findNumberRule(String ruleName, String rrule) {
    for (String part : splitRuleParts(rrule)) {
      ParseResult<NumberRule> result = parseNumberRule(part);
      if (result.result != null && result.result.name.equals(ruleName)) {
        return result.result.value;
      }
    }
    return -1;
  }
}
