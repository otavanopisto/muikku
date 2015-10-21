package fi.muikku.ui.sauce.course;

import java.net.MalformedURLException;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.muikku.ui.base.course.CourseTestsBase;

@RunWith (Parameterized.class)
public class CourseTestsIT extends CourseTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Parameterized.Parameters
  public static List<String[]> browsers() throws Exception {
    return getDefaultSauceBrowsers();
  }

  public CourseTestsIT(String browser, String version, String platform, String resolution) {
    this.browser = browser;
    this.version = version;
    this.platform = platform;
    this.resolution = resolution;
  }
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver(browser, version, platform, resolution));
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
  private String platform;
  private String browser;
  private String version;
  private String resolution;
}
