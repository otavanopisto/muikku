package fi.muikku.ui.chrome;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.CoursePickerTestsBase;

public class CoursePickerTestsIT extends CoursePickerTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(createChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
