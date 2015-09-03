package fi.muikku.ui.base;


import static org.junit.Assert.*;

import java.io.IOException;

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
import fi.muikku.webhooks.WebhookCourseCreatePayload;
import fi.muikku.webhooks.WebhookStaffMemberCreatePayload;
import fi.muikku.webhooks.WebhookStudentCreatePayload;


public class CourseMaterialsPageTestsBase extends AbstractUITest {
    
  @Test
  @SqlBefore(value = {"sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1MaterialDelete.sql"})
  public void courseMaterialExistsTest() throws Exception {
//    fix Timed out after 60 seconds waiting for presence of element located by: By.selector: .material-view
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
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
  public void courseFullscreenReadingButtonExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
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
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
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
  @SqlBefore(value = {"sql/workspace1MaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1MaterialDelete.sql"})
  public void courseTOCExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
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
  @SqlBefore(value = {"sql/workspace1MaterialSetup.sql", "sql/workspace1Material2Setup.sql"})
  @SqlAfter(value = {"sql/workspace1MaterialDelete.sql", "sql/workspace1Material2Delete.sql"})
  public void courseMaterialTOCHighlightTest() throws Exception {
//    fix Unique index or primary key violation: "PRIMARY KEY ON PUBLIC.WORKSPACENODE(ID)"; SQL statement:
//    insert into workspacenode (id, hidden, orderNumber, urlName, parent_id, title) values 
//    (43, false, 2, 'Test matherial node', 4, 'Test material')
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
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
  @SqlBefore(value = {"sql/workspace1EvaluatedMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1EvaluatedMaterialDelete.sql"})
  public void courseMaterialEvaluatedClassTest() throws Exception {
//    fix Column "TITLE" not found; SQL statement:
//    insert into workspacefolder(id, defaultMaterial_id, folderType, title)
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
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
  @SqlBefore(value = {"sql/workspace1ExerciseMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1ExerciseMaterialDelete.sql"})
  public void courseMaterialExerciseClassTest() throws Exception {
//  fix  Column "TITLE" not found; SQL statement:
//    insert into workspacefolder(id, defaultMaterial_id, folderType, title) 
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    PyramusMocks.workspace1PyramusMock();     
    payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
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
