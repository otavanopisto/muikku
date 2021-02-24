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
  }
 
}
