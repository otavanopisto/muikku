package fi.otavanopisto.muikku.ui.local.course.materials;

import org.junit.After;
import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.materials.CourseMaterialsPageTestsBase;

public class CourseMaterialsPageTestsIT extends CourseMaterialsPageTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
