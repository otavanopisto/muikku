package fi.muikku.ui.base;

import static org.junit.Assert.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial;
import fi.muikku.webhooks.WebhookCourseCreatePayload;
import fi.muikku.webhooks.WebhookStaffMemberCreatePayload;
import fi.muikku.webhooks.WebhookStudentCreatePayload;
import fi.pyramus.webhooks.WebhookCourseUpdatePayload;

public class CourseTestsBase extends AbstractUITest {
  
  @Test
//  @SqlBefore("sql/workspace1Setup.sql")
//  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new fi.muikku.webhooks.WebhookCourseCreatePayload((long) 1));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }

//  @Test
////  @SqlBefore(value = {"sql/workspace1Setup.sql"})
////  @SqlAfter(value = {"sql/workspace1Delete.sql"})
//  public void courseHomeButtonExistsTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();  
////    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
//    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
//    takeScreenshot();
//    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-home")).size() > 0;
//    WireMock.reset();
//    assertTrue(elementExists);
//  }
// 
//  @Test
////  @SqlBefore(value = {"sql/workspace1Setup.sql"})
////  @SqlAfter(value = {"sql/workspace1Delete.sql"})
//  public void courseGuideButtonExistsTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();  
////    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
//    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
//    takeScreenshot();
//    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-guides")).size() > 0;
//    WireMock.reset();
//    assertTrue(elementExists);
//  }
//  
//  @Test
////  @SqlBefore("sql/workspace1Setup.sql")
////  @SqlAfter("sql/workspace1Delete.sql")
//  public void courseMaterialButtonTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();  
////    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
//    waitForElementToBePresent(By.className("workspace-title"));
//    takeScreenshot();
//    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials")).size() > 0;
//    WireMock.reset();
//    assertTrue(elementExists);
//  }
//  
//  @Test
////  @SqlBefore("sql/workspace1Setup.sql")
////  @SqlAfter("sql/workspace1Delete.sql")
//  public void courseDiscussionButtonTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();  
////    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
//    waitForElementToBePresent(By.className("workspace-title"));
//    takeScreenshot();
//    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-discussions")).size() > 0;
//    WireMock.reset();
//    assertTrue(elementExists);
//  }
//  
//  @Test
//  public void coursePublishTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();  
////    asAdmin().get("/test/reindex");
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse");
//    waitForElementToBePresent(By.className("workspace-title"));
//    takeScreenshot();
//    getWebDriver().findElementByClassName("workspace-publish-button").click();
//    waitForElementToBePresent(By.className("workspace-title"));
//    takeScreenshot();
//    boolean elementExists = getWebDriver().findElementsByClassName("workspace-unpublish-button").size() > 0;
//    WireMock.reset();
//    assertTrue(elementExists);
//  }
//  
}
