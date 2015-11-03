package fi.muikku.ui.chrome.course.journal;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.journal.CourseJournalPageTestsBase;

public class CourseJournalPageTestsIT extends CourseJournalPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
