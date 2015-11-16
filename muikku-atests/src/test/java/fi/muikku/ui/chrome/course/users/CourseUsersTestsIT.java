package fi.muikku.ui.chrome.course.users;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.users.CourseUsersTestsBase;

public class CourseUsersTestsIT extends CourseUsersTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
