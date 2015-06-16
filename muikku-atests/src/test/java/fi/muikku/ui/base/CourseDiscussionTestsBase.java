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
  public void courseSendDiscussionMessageTest() throws IOException {
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
    getWebDriver().findElementByClassName("mf-textfield").sendKeys("Test title for discussion");
    getWebDriver().findElementByClassName("mf-textarea").sendKeys("Test text for discussion.");
    getWebDriver().findElementByName("send").click();
    sleep(500);
    takeScreenshot();
    String discussionText= getWebDriver().findElement(By.cssSelector("di-message-meta-content span p")).getText();
    System.out.print(discussionText);
    WireMock.reset();
    assertEquals(new String("Test text for discussion."), discussionText);
  }
  
}