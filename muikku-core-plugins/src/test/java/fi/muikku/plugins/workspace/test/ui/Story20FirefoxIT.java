package fi.muikku.plugins.workspace.test.ui;

import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.firefox.FirefoxDriver;

public class Story20FirefoxIT extends Story20Base {
  @Before
  public void setUp() throws Exception {
    setDriver(new FirefoxDriver());
  }
}
