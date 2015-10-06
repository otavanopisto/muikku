package fi.muikku.ui.base;

import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.atests.Workspace;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;

public class CourseDiscussionTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/courseDiscussionSendMessageTestSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/courseDiscussionSendMessageTestCleanup.sql"})
  public void courseDiscussionSendMessageTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
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
    waitAndClick("#cke_1_contents");
    getWebDriver().switchTo().activeElement().sendKeys("Test text for discussion.");
    getWebDriver().findElementByName("send").click();
    waitForPresent(".di-message-meta-content>span>p");
    assertText(".di-message-meta-content>span>p", "Test text for discussion.");
  }
  
  @Test
  @SqlAfter(value = {"sql/courseDiscussionAdminCreateAreaTestCleanup.sql"})
  public void courseDiscussionAdminCreateAreaTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    navigate(String.format("/workspace/%s/discussions", workspace.getUrlName()), true);
    waitForPresent(".workspace-discussions");
    click(".di-new-area-button");
    waitAndSendKeys(".mf-textfield input", "Test area");
    click("*[name='send']");
    waitForPresent("#discussionAreaSelect option:nth-child(2)");
    assertText("#discussionAreaSelect option:nth-child(2)", "Test area");
    deleteWorkspace(workspace.getId());
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/courseDiscussionReplyTestSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/courseDiscussionReplyTestCleanup.sql"})
  public void courseDiscussionReplyTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();     
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/discussions");
    waitForElementToBePresent(By.className("di-message-meta-topic"));
    getWebDriver().findElementByCssSelector(".di-message-meta-topic>span").click();
    waitForElementToBePresent(By.className("di-message-reply-link"));
    getWebDriver().findElementByClassName("di-message-reply-link").click();
    waitForElementToBePresent(By.id("cke_1_contents"));
    getWebDriver().findElement(By.id("cke_1_contents")).click();
    getWebDriver().switchTo().activeElement().sendKeys("Test reply for test.");
    getWebDriver().findElementByName("send").click();
    waitForPresent(".mf-subitem-content-text>p");
    assertText(".mf-subitem-content-text>p", "Test reply for test.");
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/courseDiscussionDeleteThreadSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/courseDiscussionDeleteThreadCleanup.sql"})
  public void courseDiscussionDeleteThreadTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock(); 
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
     
    asAdmin().get("/test/reindex");

    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    
    navigate("/workspace/testcourse/discussions", true);
    waitAndClick(".di-message-meta-topic>span");
    waitAndClick(".di-remove-thread-link");
    waitAndClick(".delete-button>span");
    waitForPresent(".mf-content-empty>h3");
    assertText(".mf-content-empty>h3", "No ongoing discussions");
  }  
}