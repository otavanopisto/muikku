package fi.otavanopisto.muikku.ui.local.course;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.CourseTestsBase;

public class CourseTestsIT extends CourseTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
