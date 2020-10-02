package fi.otavanopisto.muikku.wcag;

import static org.junit.Assert.assertTrue;

import java.net.URL;

import org.json.JSONArray;
import org.junit.After;
import org.junit.Before;

import com.deque.axe.AXE;

import fi.otavanopisto.muikku.ui.AbstractUITest;

public class AbstractWCAGTest extends AbstractUITest {

  protected static final URL scriptUrl = AbstractWCAGTest.class.getResource("/axe.min.js");
  
  @Before
  public void setUp() {
    // ChromeDriver needed to test for Shadow DOM testing support
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void report() {
    if (this.violations != null) {
      if (this.violations.length() == 0) {
        assertTrue("No violations found", true);
      } else {
        AXE.writeResults("target/" + testName.getMethodName(), AXE.report(this.violations));
        assertTrue(AXE.report(this.violations), false);
      }
    }
  }

  protected void testAccessibility() {
    this.violations = new AXE.Builder(getWebDriver(), scriptUrl).analyze().getJSONArray("violations");
  }

  protected JSONArray violations;
  
}
