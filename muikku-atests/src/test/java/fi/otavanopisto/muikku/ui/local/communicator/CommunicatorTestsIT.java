package fi.otavanopisto.muikku.ui.local.communicator;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.communicator.CommunicatorTestsBase;

public class CommunicatorTestsIT extends CommunicatorTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
}
