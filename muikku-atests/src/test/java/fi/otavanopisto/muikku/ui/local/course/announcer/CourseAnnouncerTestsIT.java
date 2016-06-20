package fi.otavanopisto.muikku.ui.local.course.announcer;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.announcer.CourseAnnouncerTestsBase;

public class CourseAnnouncerTestsIT extends CourseAnnouncerTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
