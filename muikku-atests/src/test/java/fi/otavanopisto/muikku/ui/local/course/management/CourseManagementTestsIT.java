package fi.otavanopisto.muikku.ui.local.course.management;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.management.CourseManagementTestsBase;

public class CourseManagementTestsIT extends CourseManagementTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
