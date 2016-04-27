package fi.otavanopisto.muikku.ui.local.course;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.CourseAccessTestBase;

public class CourseAccessTestsIT extends CourseAccessTestBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
