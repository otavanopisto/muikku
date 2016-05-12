package fi.otavanopisto.muikku.ui.local.user;

import org.junit.Before;
import fi.otavanopisto.muikku.ui.base.user.UserTestsBase;

public class UserTestsIT extends UserTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
