package fi.otavanopisto.muikku.wcag.index;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class IndexAT extends AbstractWCAGTest {

  @Test
  public void indexTest() throws JsonProcessingException, Exception {
    navigate("/", true);
    testAccessibility("Not logged in");
    login(getTestStudent(), getTestStudentPassword(), true);
    testAccessibility("Logged in");
    waitAndClick(".button-pill--profile");
    waitForVisible(".dropdown__container .dropdown__container-item");
    testAccessibility("Profile dropdown");
    waitAndClick(".button-pill--current-language");
    waitForVisible(".dropdown--language-picker");
    testAccessibility("Language picker dropdown");
    navigate("/profile", true);
    testAccessibility("Profile view");
  }
 
}
