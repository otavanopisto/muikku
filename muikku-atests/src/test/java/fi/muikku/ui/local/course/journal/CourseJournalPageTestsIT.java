package fi.muikku.ui.local.course.journal;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.journal.CourseJournalPageTestsBase;

public class CourseJournalPageTestsIT extends CourseJournalPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
