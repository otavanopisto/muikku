package fi.muikku.plugins.workspace.test.ui;

import org.junit.Before;
import org.openqa.selenium.firefox.FirefoxDriver;

public class Story20Firefox extends Story20 {

  @Before
  public void setUp() throws Exception {
    setDriver(new FirefoxDriver());
  }
  
}
