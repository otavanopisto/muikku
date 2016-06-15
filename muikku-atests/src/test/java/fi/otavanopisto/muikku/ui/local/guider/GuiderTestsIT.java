package fi.otavanopisto.muikku.ui.local.guider;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.guider.GuiderTestsBase;

public class GuiderTestsIT extends GuiderTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
