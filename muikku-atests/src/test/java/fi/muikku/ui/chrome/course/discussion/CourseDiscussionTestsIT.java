package fi.muikku.ui.chrome.course.discussion;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.discussions.CourseDiscussionTestsBase;

public class CourseDiscussionTestsIT extends CourseDiscussionTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
