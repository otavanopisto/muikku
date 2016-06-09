package fi.otavanopisto.muikku.ui.local;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.guider.GuiderTestsBase;

public class GuiderTestsIT extends GuiderTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
