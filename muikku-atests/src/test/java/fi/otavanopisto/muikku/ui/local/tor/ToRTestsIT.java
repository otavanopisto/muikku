package fi.otavanopisto.muikku.ui.local.tor;

import org.junit.Before;
import fi.otavanopisto.muikku.ui.base.tor.ToRTestsBase;

public class ToRTestsIT extends ToRTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
