package fi.muikku.plugins.workspace.test.ui;

import org.junit.Before;
import org.openqa.selenium.firefox.FirefoxDriver;

public class Story21Firefox extends Story21 {

  @Before
  public void setUp() throws Exception {
    setDriver(new FirefoxDriver());
  }
  
}
