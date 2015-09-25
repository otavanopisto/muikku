package fi.muikkku.ui;

import static com.jayway.restassured.RestAssured.certificate;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;
import com.jayway.restassured.response.Response;
import com.saucelabs.common.SauceOnDemandSessionIdProvider;

import fi.muikku.AbstractIntegrationTest;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;

public class AbstractUITest extends AbstractIntegrationTest implements SauceOnDemandSessionIdProvider {
  
  private static final long TEST_START_TIME = System.currentTimeMillis();
  
  @Rule
  public WireMockRule wireMockRule = new WireMockRule(Integer.parseInt(System.getProperty("it.wiremock.port")));

  @Before
  public void setupRestAssured() {

    RestAssured.baseURI = getAppUrl(true) + "/rest";
    RestAssured.port = getPortHttps();
    RestAssured.authentication = certificate(getKeystoreFile(), getKeystorePass());

    RestAssured.config = RestAssuredConfig.config().objectMapperConfig(
      ObjectMapperConfig.objectMapperConfig().jackson2ObjectMapperFactory(new Jackson2ObjectMapperFactory() {

        @SuppressWarnings("rawtypes")
        @Override
        public com.fasterxml.jackson.databind.ObjectMapper create(Class cls, String charset) {
          com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
          objectMapper.registerModule(new JodaModule());
          objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
          return objectMapper;
        }
      }));
  }
  
  @After
  public void resetWireMock() {
    WireMock.reset();
  }
  
  @Override
  public String getSessionId() {
    return sessionId;
  }
  
  protected void setWebDriver(RemoteWebDriver webDriver) {
    this.webDriver = webDriver;
    this.sessionId = webDriver.getSessionId().toString();
  }
  
  protected RemoteWebDriver getWebDriver() {
    return webDriver;
  }
  
  protected RemoteWebDriver createSauceWebDriver(String browser, String version, String platform) throws MalformedURLException {
    DesiredCapabilities capabilities = new DesiredCapabilities();
    
    capabilities.setCapability(CapabilityType.BROWSER_NAME, browser);
    capabilities.setCapability(CapabilityType.VERSION, version);
    capabilities.setCapability(CapabilityType.PLATFORM, platform);
    capabilities.setCapability("name", getClass().getSimpleName() + ':' + testName.getMethodName());
    capabilities.setCapability("tags", Arrays.asList( String.valueOf( getTestStartTime() ) ) );
    capabilities.setCapability("build", getProjectVersion());
    capabilities.setCapability("video-upload-on-pass", false);
    capabilities.setCapability("capture-html", true);
    capabilities.setCapability("timeZone", "Universal");
    capabilities.setCapability(CapabilityType.ACCEPT_SSL_CERTS, true);
    capabilities.setCapability("chrome.switches", Arrays.asList("--ignore-certificate-errors"));
    
    if (getSauceTunnelId() != null) {
      capabilities.setCapability("tunnel-identifier", getSauceTunnelId());
    }
    
    return new RemoteWebDriver(new URL(String.format("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", getSauceUsername(), getSauceAccessKey())), capabilities);
  }
  
  public static List<String[]> getDefaultSauceBrowsers() {
    return Arrays.asList(new String[][] {
    // ((String[]) new String[] { "firefox", "36.0", "Windows 8.1" }),
    // ((String[]) new String[] { "safari", "8.0", "OS X 10.10" }),
    ((String[]) new String[] { "chrome", "41.0", "Linux" }) });
  }
  
  public static long getTestStartTime() {
    return TEST_START_TIME;
  }

  protected void testTitle(String path, String expected) {
    getWebDriver().get(getAppUrl(true) + path);
    assertEquals(expected, getWebDriver().getTitle());
  }

  protected void testPageElementsByName(String elementName) {
    Boolean elementExists = getWebDriver().findElements(By.name(elementName)).size() > 0;
    assertEquals(true, elementExists);
  }

  protected void testLogin(String username, String password) throws InterruptedException {

  }

  protected void login(String username, String password) {

  }

  protected void waitForElementToBeClickable(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.elementToBeClickable(locator));
  }

  protected void waitForElementToBePresent(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.presenceOfElementLocated(locator));
  }

  protected void waitForUrlNotMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return !driver.getCurrentUrl().matches(regex);
      }
    });
  }

  protected void waitForUrl(final String url) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return url.equals(driver.getCurrentUrl());
      }
    });
  }

  protected void waitForUrlMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return driver.getCurrentUrl().matches(regex);
      }
    });
  }

  protected void takeScreenshot() throws IOException {
    if (getWebDriver() instanceof TakesScreenshot) {
      Date dNow = new Date();
      SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd-hh:mm:ss");
      File screenshot = ((TakesScreenshot) getWebDriver()).getScreenshotAs(OutputType.FILE);
      FileUtils.copyFile(screenshot, new File(System.getProperty("it.report.directory") + ft.format(dNow) + "-" + testName.getMethodName() + ".png"));
    }
  }

  protected void sleep(long millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
    }
  }
  
  protected static String getFullRoleName(RoleType roleType, String role) {
    // System.out.println(roleType + " ----- " + role);
    return roleType.name() + "-" + role;
  }

  protected boolean inWebElements(List<WebElement> options, String needle) {
    if (options != null) {
      for (WebElement webElement : options) {
        String optionValue = webElement.getText();
        if (optionValue.equals(needle)){
          return true;
        }
      }
    }
    return false;
  }

  protected Boolean webhookCall(String url, String payload) throws Exception {
    String signature = "38c6cbd28bf165070d070980dd1fb595";
    CloseableHttpClient client = HttpClients.createDefault();
    try {
      HttpPost httpPost = new HttpPost(url);
      try {
        StringEntity dataEntity = new StringEntity(payload);
        try {
          httpPost.addHeader("X-Pyramus-Signature", signature);
          httpPost.setEntity(dataEntity);
          client.execute(httpPost);
          return true;
        } finally {
          EntityUtils.consume(dataEntity);
        }
      } finally {
        httpPost.releaseConnection();
      }
    } finally {
      client.close();
    }
  }
  
  protected void assertPresent(String selector) {
    assertTrue(String.format("Could not find element %s", selector), getWebDriver().findElements(By.cssSelector(selector)).size() > 0);
  }
  
  protected void assertNotPresent(String selector) {
    assertTrue(String.format("Could not find element %s", selector), getWebDriver().findElements(By.cssSelector(selector)).size() == 0);
  }
  
  protected void assertVisible(String selector) {
    assertPresent(selector);
    assertTrue(String.format("Element %s not visible", selector), getWebDriver().findElement(By.cssSelector(selector)).isDisplayed());
  }
  
  protected void assertNotVisible(String selector) {
    List<WebElement> elements = getWebDriver().findElements(By.cssSelector(selector));
    if (elements.size() > 0) {
      for (WebElement element : elements) {
        if (element.isDisplayed()) {
          throw new AssertionError(String.format("Element %s is visible", selector));
        }
      }
    }
  }
  
  protected void navigate(String path, boolean secure) {
    getWebDriver().get(String.format("%s%s", getAppUrl(secure), path));
  }
  
  protected void waitForPresent(String selector) {
    waitForElementToBePresent(By.cssSelector(selector));
  }
  
  protected void click(String selector) {
    getWebDriver().findElement(By.cssSelector(selector)).click();
  }
  
  protected void waitAndClick(String selector) {
    waitForPresent(selector);
    click(selector);
  }

  protected void assertText(String selector, String text) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(text, element.getText());
  }

  protected void sendKeys(String selector, String keysToSend) {
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(keysToSend);
  }
  
  protected void loginAdmin() throws JsonProcessingException, Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    navigate("/login?authSourceId=1", true);
    waitForPresent(".index");
  }
  
  protected Workspace createWorkspace(String name, String identifier, Boolean published) throws IOException {
    PyramusMocks.workspacePyramusMock(NumberUtils.createLong(identifier));

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Workspace payload = new Workspace(null, name, null, "PYRAMUS", identifier, published);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces");
    
    response.then()
      .statusCode(200);
      
    Workspace workspace = objectMapper.readValue(response.asString(), Workspace.class);
    assertNotNull(workspace);
    assertNotNull(workspace.getId());
    
    return workspace;
  }
  
  protected void deleteWorkspace(Long id) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEID}", id)
      .then()
      .statusCode(204);
  }
  
  protected WorkspaceFolder createWorkspaceFolder(Long workspaceEntityId, Long parentId, Boolean hidden, Integer orderNumber, String title, String folderType) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceFolder payload = new WorkspaceFolder(null, hidden, orderNumber, null, title, parentId);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYIID}/folders", workspaceEntityId);
    
    response.then()
      .statusCode(200);
      
    WorkspaceFolder result = objectMapper.readValue(response.asString(), WorkspaceFolder.class);
    assertNotNull(result);
    assertNotNull(result.getId());
    
    return result;
  }
  
  protected WorkspaceHtmlMaterial createWorkspaceHtmlMaterial(Long workspaceEntityId, Long parentId, String title, String contentType, String html, Long revisionNumber, String assignmentType) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceHtmlMaterial payload = new WorkspaceHtmlMaterial(null, parentId, title, contentType, html, revisionNumber, assignmentType);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYIID}/htmlmaterials", workspaceEntityId);
    
    response.then()
      .statusCode(200);
      
    WorkspaceHtmlMaterial result = objectMapper.readValue(response.asString(), WorkspaceHtmlMaterial.class);
    assertNotNull(result);
    assertNotNull(result.getId());
    
    return result;
  }

  protected void deleteWorkspaceHtmlMaterial(Long workspaceEntityId, Long id) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEID}/htmlmaterials/{WORKSPACEMATERIALID}", workspaceEntityId, id)
      .then()
      .statusCode(204);
  }
  
  enum RoleType {
    PSEUDO, ENVIRONMENT, WORKSPACE
  }

  private RemoteWebDriver webDriver;
  private String sessionId;

}