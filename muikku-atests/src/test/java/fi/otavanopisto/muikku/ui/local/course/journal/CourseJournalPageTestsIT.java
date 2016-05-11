package fi.otavanopisto.muikku.ui.local.course.journal;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.journal.CourseJournalPageTestsBase;

public class CourseJournalPageTestsIT extends CourseJournalPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
