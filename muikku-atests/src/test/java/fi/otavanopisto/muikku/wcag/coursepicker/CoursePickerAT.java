package fi.otavanopisto.muikku.wcag.coursepicker;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class CoursePickerAT extends AbstractWCAGTest {

  @Test
  public void coursePickerTest () throws JsonProcessingException, Exception {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/coursepicker", true);
    waitForVisible(".application-list__item.course");
    testAccessibility("Course Picker:");
  }
  
}
