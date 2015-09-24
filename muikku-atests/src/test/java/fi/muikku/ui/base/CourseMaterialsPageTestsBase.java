package fi.muikku.ui.base;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.atests.Workspace;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;

public class CourseMaterialsPageTestsBase extends AbstractUITest {

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql"})
  public void courseMaterialExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql"})
  public void courseFullscreenReadingButtonExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
  public void courseMaterialManagementButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
    waitForPresent("#contentWorkspaceMaterials");
    assertPresent(".wi-workspace-dock-navi-button-materials-management");
    deleteWorkspace(workspace.getId());
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1MaterialSetup.sql", "sql/workspace1Material2Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1MaterialDelete.sql", "sql/workspace1Material2Delete.sql"})
  public void courseTOCExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
  public void courseMaterialTOCHighlightTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.linkText("Test material 2.0"));
    getWebDriver().findElementByLinkText("Test material 2.0").click();
    waitForElementToBePresent(By.linkText("Test material 2.0"));
    sleep(1000);
    String actual = getWebDriver().findElementByLinkText("Test material 2.0").getAttribute("class");
    String expected = new String("active");
    assertEquals(expected, actual);
    WireMock.reset();
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1EvaluatedMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1EvaluatedMaterialDelete.sql"})
  public void courseMaterialEvaluatedClassTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
  public void courseMaterialExerciseClassTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
