package fi.muikku.ui.chrome;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.CourseMaterialsPageTestsBase;

public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
