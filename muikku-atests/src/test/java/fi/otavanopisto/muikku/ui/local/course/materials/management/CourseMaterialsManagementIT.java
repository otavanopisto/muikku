package fi.otavanopisto.muikku.ui.local.course.materials.management;

import org.junit.Before;

import fi.otavanopisto.muikku.ui.base.course.materials.management.CourseMaterialsManagementTestsBase;

public class CourseMaterialsManagementIT extends CourseMaterialsManagementTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createLocalDriver());
  }

}
