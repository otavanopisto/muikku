package fi.muikku.ui.local;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.GuiderTestsBase;

public class GuiderTestsIT extends GuiderTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
