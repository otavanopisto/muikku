package fi.muikku.ui.chrome;

import org.junit.After;
import org.junit.Before;
import org.openqa.selenium.chrome.ChromeDriver;

import fi.muikku.ui.base.CoursePickerTestsBase;

public class CoursePickerTestsIT extends CoursePickerTestsBase {
  
  @Before
  public void setUp() {
    setWebDriver(new ChromeDriver());
  }
  
  @After
  public void tearDown() {
    getWebDriver().quit();
  }
  
}
