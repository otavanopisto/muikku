package fi.muikku.ui.chrome.communicator;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.communicator.CommunicatorTestsBase;

public class CommunicatorTestsIT extends CommunicatorTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
