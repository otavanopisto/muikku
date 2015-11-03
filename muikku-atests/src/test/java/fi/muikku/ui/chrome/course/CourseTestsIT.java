package fi.muikku.ui.chrome.course;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.CourseTestsBase;

public class CourseTestsIT extends CourseTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
