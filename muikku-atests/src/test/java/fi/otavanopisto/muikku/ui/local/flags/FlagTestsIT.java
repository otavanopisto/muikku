package fi.otavanopisto.muikku.ui.local.flags;

import org.junit.Before;
import fi.otavanopisto.muikku.ui.base.flags.FlagTestsBase;

public class FlagTestsIT extends FlagTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
