package fi.otavanopisto.muikku.ui.sauce.indexpage;

import java.net.MalformedURLException;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;

import com.saucelabs.common.SauceOnDemandAuthentication;
import com.saucelabs.junit.SauceOnDemandTestWatcher;

import fi.otavanopisto.muikku.ui.base.indexpage.IndexPageTestsBase;

public class IndexPageTestsIT extends IndexPageTestsBase {
  
  public SauceOnDemandAuthentication authentication = new SauceOnDemandAuthentication(getSauceUsername(), getSauceAccessKey());

  @Rule
  public SauceOnDemandTestWatcher resultReportingTestWatcher = new SauceOnDemandTestWatcher(this, authentication);
  
  @Before
  public void setUp() throws MalformedURLException {
    setWebDriver(createSauceWebDriver());
  }

}
