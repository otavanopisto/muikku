package fi.muikku.ui.base;

import static org.junit.Assert.*;

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
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;

public class CourseTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseHomeButtonExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);

    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-home")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
 
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseGuideButtonExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);

    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-guides")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseMaterialButtonTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);

    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseDiscussionButtonTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-discussions")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseUnpublishTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);

    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    getWebDriver().findElementByClassName("workspace-unpublish-button").click();
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElementsByClassName("workspace-publish-button").size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
}
