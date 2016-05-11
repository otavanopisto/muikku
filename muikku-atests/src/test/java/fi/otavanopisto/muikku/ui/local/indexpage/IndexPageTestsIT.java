package fi.otavanopisto.muikku.ui.local.indexpage;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.indexpage.IndexPageTestsBase;

public class IndexPageTestsIT extends IndexPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
