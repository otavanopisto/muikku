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

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.plugins.workspace.rest.model.WorkspaceMaterial;

public class CourseDiscussionTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1DiscussionSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1DiscussionDelete.sql"})
  public void courseDiscussioSendnMessageTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/discussions");
    waitForElementToBePresent(By.className("workspace-discussions"));
    getWebDriver().findElementByClassName("di-new-message-button").click();
    getWebDriver().findElementByCssSelector(".mf-textfield input").sendKeys("Test title for discussion");
    getWebDriver().findElement(By.id("cke_1_contents")).click();
    getWebDriver().switchTo().activeElement().sendKeys("Test text for discussion.");
    getWebDriver().findElementByName("send").click();
    sleep(500);
    takeScreenshot();
    String discussionText = getWebDriver().findElement(By.cssSelector(".di-message-meta-content>span>p")).getText();
    WireMock.reset();
    assertEquals(new String("Test text for discussion."), discussionText);
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseDiscussionCreateAreaTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse/discussions");
    waitForElementToBePresent(By.className("workspace-discussions"));
    getWebDriver().findElementByClassName("di-new-area-button").click();
    getWebDriver().findElementByCssSelector(".mf-textfieldriverd input").sendKeys("Test area");
    getWebDriver().findElementByName("send").click();
    sleep(500);
    
    Select select = new Select(getWebDriver().findElement(By.id("discussionAreaSelect")));
    List<WebElement> options = select.getOptions();
    boolean found = inWebElements(options, "Test area");
    WireMock.reset();
    assertTrue(found);
  }  
}