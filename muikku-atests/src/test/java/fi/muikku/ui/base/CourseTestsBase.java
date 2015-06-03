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

public class CourseTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws IOException {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    getWebDriver().manage().window().maximize();
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseHomeButtonExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-home")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
 
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql"})
  public void courseGuideButtonExistsTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.cssSelector("#workspaceNavigationWrapper"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-guides")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseMaterialButtonTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    asAdmin().get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("wi-workspace-dock-navi-button-materials")).size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void coursePublishTest() throws IOException {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();  
    
    HttpClient httpClient = new DefaultHttpClient();
    HttpPost httpPost = new HttpPost("https://dev.muikku.fi:8443/pyramus/webhook");
    // Request parameters and other properties.
    List<NameValuePair> params = new ArrayList<NameValuePair>();
    params.add(new BasicNameValuePair("webhook.secret", "11111111-1111-1111-1111-111111111111"));
    try {
        httpPost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
    } catch (UnsupportedEncodingException e) {
        // writing error to Log
        e.printStackTrace();
    }
    /*
     * Execute the HTTP Request
     */
    try {
        HttpResponse response = httpClient.execute(httpPost);
        HttpEntity respEntity = response.getEntity();

        if (respEntity != null) {
            // EntityUtils to get the response content
            String content =  EntityUtils.toString(respEntity);
        }
    } catch (ClientProtocolException e) {
        // writing exception to log
        e.printStackTrace();
    } catch (IOException e) {
        // writing exception to log
        e.printStackTrace();
    }
//    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    getWebDriver().findElementByClassName("workspace-publish-button").click();
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElementsByClassName("workspace-unpublish-button").size() > 0;
    WireMock.reset();
    assertTrue(elementExists);
  }
  
}
