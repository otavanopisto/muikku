package fi.otavanopisto.muikku.ui.local.course;

import org.junit.After;
import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.CourseAccessTestsBase;

public class CourseAccessTestsIT extends CourseAccessTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
