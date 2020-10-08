package fi.otavanopisto.muikku.wcag;

import static org.junit.Assert.assertTrue;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.junit.After;
import org.junit.Before;

import com.deque.axe.AXE;

import fi.otavanopisto.muikku.ui.AbstractUITest;

public class AbstractWCAGTest extends AbstractUITest {

  protected static final URL scriptUrl = AbstractWCAGTest.class.getResource("/axe.min.js");
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  protected void reportWCAG() {
    if (!System.getProperty("it.profile").equals("sauce-it")) {
      if (this.violationList != null) {
        if (!this.violationList.isEmpty()) {
          String violationsString = "";          
          for (Map.Entry<String, JSONArray> violation : violationList.entrySet()) {
            violationsString += System.getProperty("line.separator");
            violationsString += violation.getKey();
            violationsString += System.getProperty("line.separator");
            violationsString += AXE.report(violation.getValue());
            violationsString += System.getProperty("line.separator");
          }
          assertTrue(violationsString, false);
        }
      }
    }
  }
    
  protected void testAccessibility() {
    if (!System.getProperty("it.profile").equals("sauce-it")) {
      if (this.violationList == null) {
        this.violationList = new HashMap<String, JSONArray>();
      }
      this.violationList.put("default", new AXE.Builder(getWebDriver(), scriptUrl).analyze().getJSONArray("violations"));
    }
  }
  
}
