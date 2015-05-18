package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void coursePickerExistsTest() throws IOException {
    initializePyramusLoginMocks();
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl() + "/coursepicker");
    waitForElementToBePresent(By.className("bt-mainFunction-content"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("coursePicker")).size() > 0;
    assertTrue(elementExists);
  }
  
}
