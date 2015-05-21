package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;

public class CourseTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseMaterialButtonTest() throws IOException {
    PyramusMocks.admin1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.cssSelector("a.icon-materials")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
}
