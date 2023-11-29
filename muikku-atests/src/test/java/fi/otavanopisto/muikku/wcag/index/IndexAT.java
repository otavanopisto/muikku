package fi.otavanopisto.muikku.wcag.index;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class IndexAT extends AbstractWCAGTest {

  @Test
  public void indexTest() throws JsonProcessingException, Exception {
    navigate("/", true);
    waitForVisible(".hero");
    waitForVisible("#studying");
    waitForVisible("#videos");
    waitForVisible("#news");
    waitForVisible("#organization");
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
 
  @Test
  public void loginTest() throws JsonProcessingException, Exception {
    navigate("/", true);
    navigate("/login?authSourceId=1", true);
    waitForPresent("input#username");
    waitForPresent("input#password");
    testAccessibility("Login view");
  }
  
}
