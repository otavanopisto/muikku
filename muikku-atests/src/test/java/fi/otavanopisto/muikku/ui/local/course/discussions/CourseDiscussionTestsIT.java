package fi.otavanopisto.muikku.ui.local.course.discussions;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.discussions.CourseDiscussionTestsBase;

public class CourseDiscussionTestsIT extends CourseDiscussionTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
