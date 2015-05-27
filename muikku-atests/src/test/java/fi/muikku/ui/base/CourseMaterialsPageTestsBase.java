package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial;

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
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
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
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
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
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
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
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
    waitForElementToBePresent(By.cssSelector("#contentWorkspaceMaterials"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.cssSelector("#workspaceMaterialsTOCWrapper")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql", "sql/workspace1Material2Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql", "sql/workspace1Material2Delete.sql"})
  public void courseMaterialSubTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
    waitForElementToBePresent(By.cssSelector(".material-view"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.cssSelector("article p")).size() > 0;
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
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/materials");
    waitForElementToBePresent(By.cssSelector("#workspaceMaterialsTOCWrapper"));
//    getWebDriver().findElements(By.)("#page-43")
    
    WireMock.reset();
    assertTrue(elementExists);
  }
  
}
