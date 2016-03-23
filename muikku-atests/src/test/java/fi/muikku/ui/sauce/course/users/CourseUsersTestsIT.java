package fi.muikku.ui.sauce.course.users;

import java.net.MalformedURLException;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.muikku.ui.base.course.users.CourseUsersTestsBase;

public class CourseUsersTestsIT extends CourseUsersTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver());
  }

}
