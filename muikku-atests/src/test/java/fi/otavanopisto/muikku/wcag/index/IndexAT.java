package fi.otavanopisto.muikku.wcag.index;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.After;
import org.junit.Test;

import com.deque.axe.AXE;
import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Sex;

public class IndexAT extends AbstractWCAGTest {

  @Test
  public void frontpage() {
    navigate("/", false);
    JSONObject responseJSON = new AXE.Builder(getWebDriver(), scriptUrl).analyze();
    this.violations = responseJSON.getJSONArray("violations");
  }

  @Test
  public void loggedInFrontpage() throws JsonProcessingException, Exception {
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, TestUtilities.toDate(1990, 1, 1), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStudent(student).mockLogin(student).build();
    try{
      login();
      JSONObject responseJSON = new AXE.Builder(getWebDriver(), scriptUrl).analyze();
      this.violations = responseJSON.getJSONArray("violations");
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @After
  public void report() {
    if (violations.length() == 0) {
      assertTrue("No violations found", true);
    } else {
      AXE.writeResults("target/" + testName.getMethodName(), AXE.report(violations));
      assertTrue(AXE.report(violations), false);
    }
  }
}
