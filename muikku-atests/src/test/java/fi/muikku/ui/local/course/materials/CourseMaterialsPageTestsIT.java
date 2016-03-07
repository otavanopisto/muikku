package fi.muikku.ui.local.course.materials;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.materials.CourseMaterialsPageTestsBase;

public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
   
}
