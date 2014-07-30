/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package fi.muikku.plugins.googlecalendar;

import java.util.Calendar;
import java.util.Date;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Ilmo Euro <ilmo.euro@gmail.com>
 */
public class GoogleCalendarEventRecurrenceParserTest {

  public GoogleCalendarEventRecurrenceParserTest() {
  }

  @Test
  public void testParseDate() {
    String date = "19700101";
    Calendar cal = Calendar.getInstance();
    cal.clear();
    cal.set(1970, 1, 1);
    Date expected = cal.getTime();
    Date actual = GoogleCalendarEventRecurrenceParser.parseDate(date).result;
    assertEquals(expected, actual);
  }

  @Test
  public void testParseDateTime() {
    String dateTime = "19700101T123000";
    Calendar cal = Calendar.getInstance();
    cal.clear();
    cal.set(1970, 1, 1, 12, 30, 00);
    Date expected = cal.getTime();
    Date actual = GoogleCalendarEventRecurrenceParser.parseDateTime(dateTime).result;
    assertEquals(expected, actual);
  }

  @Test
  public void testParseDateExtraChars() {
    String input = "19700101extra";
    String expected = "extra";
    GoogleCalendarEventRecurrenceParser.ParseResult<Date> result
            = GoogleCalendarEventRecurrenceParser.parseDate(input);
    assertNotNull("Parse failed", result.result);
    String actual = result.rest;
    assertEquals(expected, actual);
  }
}