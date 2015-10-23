package fi.muikku.ui.chrome.course.picker;

import org.junit.After;
import org.junit.Before;

import fi.muikku.ui.base.course.picker.CoursePickerTestsBase;

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
