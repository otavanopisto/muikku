package fi.muikku.ui.base;


import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;


public class CourseMaterialsPageTestsBase extends AbstractUITest {
    
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql"})
  public void courseMaterialExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.cssSelector(".material-view"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.cssSelector("article p")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseFullscreenReadingButtonExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials-reading")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseMaterialManagementButtonExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials-management")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
 
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql"})
  public void courseTOCExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.cssSelector("#contentWorkspaceMaterials"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.cssSelector("#workspaceMaterialsTOCWrapper")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
    
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql", "sql/workspace1Material2Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql", "sql/workspace1Material2Delete.sql"})
  public void courseMaterialTOCHighlightTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.cssSelector("#workspaceMaterialsTOCWrapper"));
    getWebDriver().findElementByLinkText("2.0 Testmaterial").click();
    sleep(500);
    String actual = getWebDriver().findElementByLinkText("2.0 Testmaterial").getAttribute("class");
    String expected = new String("active");
    assertEquals(expected, actual);
    WireMock.reset();
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1EvaluatedMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1EvaluatedMaterialDelete.sql"})
  public void courseMaterialEvaluatedClassTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.id("contentWorkspaceMaterials"));
    String actual = getWebDriver().findElementByCssSelector("#page-45>div").getAttribute("class");
    String expected = new String("muikku-page-assignment-type evaluated");
    assertEquals(expected, actual);
    WireMock.reset();
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1ExerciseMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1ExerciseMaterialDelete.sql"})
  public void courseMaterialExerciseClassTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.id("contentWorkspaceMaterials"));
    String actual = getWebDriver().findElementByCssSelector("#page-46>div").getAttribute("class");
    String expected = new String("muikku-page-assignment-type exercise");
    assertEquals(expected, actual);
    WireMock.reset();
  }
  
}
