package fi.otavanopisto.muikku.ui.local.announcer;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.announcer.AnnouncerTestsBase;

public class AnnouncerTestsIT extends AnnouncerTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
