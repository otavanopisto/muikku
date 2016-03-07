package fi.muikku.ui.local.course.users;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.users.CourseUsersTestsBase;

public class CourseUsersTestsIT extends CourseUsersTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
