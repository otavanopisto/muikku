package fi.muikku.ui.chrome.course.materials;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.materials.CourseMaterialsPageTestsBase;

public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
  @Override
  public void answerFileFieldTestAdmin() throws Exception {
    if (getSauceBrowser().equals("internet explorer") && getSauceBrowserVersion().equals("10.0")) {
      return;
    }
    
    super.answerFileFieldTestAdmin();
  }
  
}
