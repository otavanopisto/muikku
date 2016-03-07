package fi.muikku.ui.local.announcer;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.announcer.AnnouncerTestsBase;

public class AnnouncerTestsIT extends AnnouncerTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
