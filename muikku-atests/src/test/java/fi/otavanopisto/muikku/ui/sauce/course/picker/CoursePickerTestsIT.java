package fi.otavanopisto.muikku.ui.sauce.course.picker;

import java.net.MalformedURLException;

import org.junit.Before;
import org.junit.Rule;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.otavanopisto.muikku.ui.base.course.picker.CoursePickerTestsBase;

public class CoursePickerTestsIT extends CoursePickerTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);

  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver());
  }

}
