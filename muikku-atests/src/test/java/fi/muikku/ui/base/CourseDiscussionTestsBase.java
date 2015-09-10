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
import org.openqa.selenium.support.ui.Select;

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

public class CourseDiscussionTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1DiscussionAreaSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1DiscussionAreaDelete.sql", "sql/workspace1DiscussionMessageDelete.sql"})
  public void courseDiscussioSendMessageTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/createcourse");
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/discussions");
    waitForElementToBePresent(By.className("workspace-discussions"));
    getWebDriver().findElementByClassName("di-new-message-button").click();
    waitForElementToBePresent(By.cssSelector(".mf-textfield-subcontainer input"));
    getWebDriver().findElementByCssSelector(".mf-textfield-subcontainer input").click();
    getWebDriver().findElementByCssSelector(".mf-textfield-subcontainer input").sendKeys("Test title for discussion");
    getWebDriver().findElement(By.id("cke_1_contents")).click();
    getWebDriver().switchTo().activeElement().sendKeys("Test text for discussion.");
    getWebDriver().findElementByName("send").click();
    sleep(500);
    takeScreenshot();
    String discussionText = getWebDriver().findElement(By.cssSelector(".di-message-meta-content>span>p")).getText();
    WireMock.reset();
    assertEquals(new String("Test text for discussion."), discussionText);
  }
  
//  403 from rest service. Ehm?!?!?!
//  @Test
//  @SqlBefore(value = {"sql/workspace1Setup.sql"})
//  @SqlAfter(value = {"sql/workspace1Delete.sql"})
//  public void courseDiscussionAdminCreateAreaTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//
//    asAdmin().get("/test/createcourse");
//    asAdmin().get("/test/reindex");
//    
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    getWebDriver().manage().window().maximize();
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/discussions");
//    waitForElementToBePresent(By.className("workspace-discussions"));
//    getWebDriver().findElementByClassName("di-new-area-button").click();
//    sleep(500);
//    getWebDriver().findElementByCssSelector(".mf-textfield input").sendKeys("Test area");
//    getWebDriver().findElementByName("send").click();
//    sleep(500);
//    
//    WebElement wElement = getWebDriver().findElement(By.id("discussionAreaSelect"));
//    List<WebElement> options = wElement.findElements(By.tagName("option"));
//    boolean found = inWebElements(options, "Test area");
//    WireMock.reset();
//    assertTrue(found);
//  }
//  
//  @Test
//  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1DiscussionAreaSetup.sql", "sql/workspace1DiscussionMessageSetup.sql"})
//  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1DiscussionAreaDelete.sql", "sql/workspace1DiscussionMessageDelete.sql", "sql/workspace1DiscussionMessageReplyCleanup.sql"})
//  public void courseDiscussionReplyTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock();     
//    
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//    
//    asAdmin().get("/test/createcourse");
//    asAdmin().get("/test/reindex");
//    
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    getWebDriver().manage().window().maximize();
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/discussions");
//    waitForElementToBePresent(By.className("di-message-meta-topic"));
//    getWebDriver().findElementByCssSelector(".di-message-meta-topic>span").click();
//    waitForElementToBePresent(By.className("di-message-reply-link"));
//    getWebDriver().findElementByClassName("di-message-reply-link").click();
//    waitForElementToBePresent(By.id("cke_1_contents"));
//    getWebDriver().findElement(By.id("cke_1_contents")).click();
//    getWebDriver().switchTo().activeElement().sendKeys("Test reply for test.");
//    getWebDriver().findElementByName("send").click();
//    waitForElementToBePresent(By.className("mf-subitem-content-text"));
//    String reply = getWebDriver().findElementByCssSelector(".mf-subitem-content-text>p").getText();
//    sleep(500);
//    takeScreenshot();
//    WireMock.reset();
//    assertEquals(new String("Test reply for test."), reply);
//  }
//
//  @Test
//  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1DiscussionAreaSetup.sql", "sql/workspace1DiscussionMessageSetup.sql"})
//  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1DiscussionAreaDelete.sql", "sql/workspace1DiscussionMessageDelete.sql"})
//  public void courseDiscussionDeleteThreadTest() throws Exception {
//    PyramusMocks.adminLoginMock();
//    PyramusMocks.personsPyramusMocks();
//    PyramusMocks.workspace1PyramusMock(); 
//    
//    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 1));
//    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
//     
//    asAdmin().get("/test/createcourse");
//    asAdmin().get("/test/reindex");
//    
//    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
//    getWebDriver().manage().window().maximize();
//    waitForElementToBePresent(By.className("index"));
//    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/discussions");
//    waitForElementToBePresent(By.className("workspace-discussions"));
//    getWebDriver().findElementByCssSelector(".di-message-meta-topic>span").click();
//    waitForElementToBePresent(By.className("di-remove-thread-link"));
//    getWebDriver().findElementByClassName("di-remove-thread-link").click();
//    waitForElementToBePresent(By.className("delete-button"));
//    getWebDriver().findElementByCssSelector(".delete-button>span").click();
//    waitForElementToBePresent(By.className("workspace-discussions"));
//    String content = getWebDriver().findElement(By.cssSelector(".mf-content-empty>h3")).getText();
//    WireMock.reset();
//    assertEquals(new String("No ongoing discussions"), content);
//  }  
}