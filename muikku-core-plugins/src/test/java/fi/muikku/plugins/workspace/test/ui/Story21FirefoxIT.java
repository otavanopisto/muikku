package fi.muikku.plugins.workspace.test.ui;

import org.junit.Before;
import org.openqa.selenium.firefox.FirefoxDriver;

public class Story21FirefoxIT extends Story21Base {

  @Before
  public void setUp() throws Exception {
    setDriver(new FirefoxDriver());
  }
  
}
