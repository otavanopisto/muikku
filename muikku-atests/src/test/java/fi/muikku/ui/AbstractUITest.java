package fi.muikku.ui;

import static com.jayway.restassured.RestAssured.certificate;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
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
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.runner.Description;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import wiremock.org.apache.commons.lang.StringUtils;

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
import fi.muikku.TestUtilities;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceDiscussion;
import fi.muikku.atests.WorkspaceDiscussionGroup;
import fi.muikku.atests.WorkspaceDiscussionThread;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;
import fi.pyramus.webhooks.WebhookStudentCreatePayload;

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
  protected void failed(Throwable e, Description description) {
    try {
      takeScreenshot();
    } catch (IOException e1) {
      throw new RuntimeException(e);
    }
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

  protected String getSauceBrowser() {
    return System.getProperty("it.sauce.browser");
  }
  
  protected String getSauceBrowserVersion() {
    return System.getProperty("it.sauce.browser.version");
  }
  
  protected String getSauceBrowserResolution() {
    return System.getProperty("it.sauce.browser.resolution");
  }
  
  protected String getSaucePlatform() {
    return System.getProperty("it.sauce.platform");
  }
  
  protected RemoteWebDriver createSauceWebDriver() throws MalformedURLException {
    final DesiredCapabilities capabilities = new DesiredCapabilities();
    final String seleniumVersion = System.getProperty("it.selenium.version");
    
    final String browser = getSauceBrowser();
    final String browserVersion = getSauceBrowserVersion();
    final String browserResolution = getSauceBrowserResolution();
    final String platform = getSaucePlatform();
    
    capabilities.setCapability(CapabilityType.BROWSER_NAME, browser);
    capabilities.setCapability(CapabilityType.VERSION, browserVersion);
    capabilities.setCapability(CapabilityType.PLATFORM, platform);
    capabilities.setCapability("name", getClass().getSimpleName() + ':' + testName.getMethodName());
    capabilities.setCapability("tags", Arrays.asList( String.valueOf( getTestStartTime() ) ) );
    capabilities.setCapability("build", getProjectVersion());
    capabilities.setCapability("video-upload-on-pass", false);
    capabilities.setCapability("capture-html", true);
    capabilities.setCapability("timeZone", "Universal");
    capabilities.setCapability("seleniumVersion", seleniumVersion);
    
    if (!StringUtils.isBlank(browserResolution)) {
      capabilities.setCapability("screenResolution", browserResolution);
    }
    
    if (getSauceTunnelId() != null) {
      capabilities.setCapability("tunnel-identifier", getSauceTunnelId());
    }
    
    return new RemoteWebDriver(new URL(String.format("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", getSauceUsername(), getSauceAccessKey())), capabilities);
  }
  
  protected RemoteWebDriver createChromeDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--lang=en_US");
    options.addArguments("start-maximized");
    ChromeDriver chromeDriver = new ChromeDriver(options);
    return chromeDriver;
  }

  protected RemoteWebDriver createFirefoxDriver() {
    FirefoxProfile firefoxProfile = new FirefoxProfile();
    firefoxProfile.setPreference("intl.accept_languages", "en");
    FirefoxDriver firefoxDriver = new FirefoxDriver(firefoxProfile);
    return firefoxDriver;
  }
  
  public static List<String[]> getDefaultSauceBrowsers() {
    return Arrays.asList(new String[][] {
    // ((String[]) new String[] { "firefox", "36.0", "Windows 8.1" }),
    // ((String[]) new String[] { "safari", "8.0", "OS X 10.10" }),
    ((String[]) new String[] { "chrome", "41.0", "Linux", null }) });
  }
  
  public static List<String[]> getAllSauceBrowsers() {
    return Arrays.asList(new String[][] {
      ((String[]) new String[] { "microsoftedge", "20.10240", "Windows 10", "1280x1024"}),
      ((String[]) new String[] { "internet explorer", "11.0", "Windows 10", "1280x1024"}),
      ((String[]) new String[] { "internet explorer", "10.0", "Windows 8", "1280x1024"}),
      ((String[]) new String[] { "firefox", "41.0", "Windows 8.1", "1280x1024"}),
      ((String[]) new String[] { "safari", "8.0", "OS X 10.10", "1280x1024" }),
      ((String[]) new String[] { "safari", "8.1", "OS X 10.11", null }),
      ((String[]) new String[] { "chrome", "45.0", "Linux", null }) 
      });
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

  protected void maximizeWindow() {
    getWebDriver().manage().window().maximize();
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

  protected void selectOption(String selector, String value){
    Select selectField = new Select(getWebDriver().findElementByCssSelector(selector));
    selectField.selectByValue(value);
    
  }
  
  protected void assertText(String selector, String text) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(text, element.getText());
  }

  protected void sendKeys(String selector, String keysToSend) {
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(keysToSend);
  }
  
  protected void waitAndSendKeys(String selector, String keysToSend) {
    waitForPresent(selector);
    sendKeys(selector, keysToSend);
  }

  protected void waitClassPresent(final String selector, final String className) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        List<WebElement> elements = getWebDriver().findElements(By.cssSelector(selector));
        if (!elements.isEmpty()) {
          WebElement element = elements.get(0);
          String[] classes = StringUtils.split(element.getAttribute("class"), " ");
          return ArrayUtils.contains(classes, className);
        }
        
        return false;
      }
    });
  }

  protected void assertClassNotPresent(String selector, String className) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    String[] classes = StringUtils.split(element.getAttribute("class"), " ");
    assertFalse(String.format("Class %s present in %s", className, selector), ArrayUtils.contains(classes, className));
  }

  protected void assertClassPresent(String selector, String className) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    String[] classes = StringUtils.split(element.getAttribute("class"), " ");
    assertTrue(String.format("Class %s is not present in %s", className, selector), ArrayUtils.contains(classes, className));
  }
  
  protected void assertValue(String selector, String value) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(value, element.getAttribute("value"));
  }
  
  protected void assertSelectedOption(String selector, String expected){
    Select select = new Select(getWebDriver().findElementByCssSelector(selector));
    WebElement option = select.getFirstSelectedOption();
    String optionText = option.getText();
    assertEquals(expected, optionText);
  }
  protected void assertChecked(String selector, Boolean expected) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(expected, element.isSelected());
  }
  
  protected void loginAdmin() throws JsonProcessingException, Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.adminMock();
    navigate("/login?authSourceId=1", true);
    waitForPresent(".index");
  }
  
  protected void loginStudent1() throws JsonProcessingException, Exception {
    PyramusMocks.student1LoginMock();
    PyramusMocks.personsPyramusMocks();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 1));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 1));
    TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    navigate("/login?authSourceId=1", true);
    waitForPresent(".index");
  }
  
  protected void loginStudent2() throws JsonProcessingException, Exception {
    PyramusMocks.student2LoginMock();
    PyramusMocks.personsPyramusMocks();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String payload = objectMapper.writeValueAsString(new WebhookStudentCreatePayload((long) 2));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 2));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    navigate("/login?authSourceId=1", true);
    waitForPresent(".index");
  }
  
  protected Workspace createWorkspace(String name, String description, String identifier, Boolean published) throws IOException {
    PyramusMocks.workspacePyramusMock(NumberUtils.createLong(identifier), name, description);

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
  
  protected WorkspaceDiscussionGroup createWorkspaceDiscussionGroup(Long workspaceEntityId, String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceDiscussionGroup payload = new WorkspaceDiscussionGroup(null, name);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups", workspaceEntityId);
    
    response.then()
      .statusCode(200);
      
    WorkspaceDiscussionGroup workspaceDiscussionGroup = objectMapper.readValue(response.asString(), WorkspaceDiscussionGroup.class);
    assertNotNull(workspaceDiscussionGroup);
    assertNotNull(workspaceDiscussionGroup.getId());
    
    return workspaceDiscussionGroup;
  }
  
  protected void deleteWorkspaceDiscussionGroup(Long workspaceEntityId, Long groupId) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}", workspaceEntityId, groupId)
      .then()
      .statusCode(204);
  }
  
  protected WorkspaceDiscussion createWorkspaceDiscussion(Long workspaceEntityId, Long groupId, String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceDiscussion payload = new WorkspaceDiscussion(null, name, groupId);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions", workspaceEntityId, groupId);
    
    response.then()
      .statusCode(200);
      
    WorkspaceDiscussion workspaceDiscussion = objectMapper.readValue(response.asString(), WorkspaceDiscussion.class);
    assertNotNull(workspaceDiscussion);
    assertNotNull(workspaceDiscussion.getId());
    
    return workspaceDiscussion;
  }

  protected void deleteWorkspaceDiscussion(Long workspaceEntityId, Long groupId, Long id) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{ID}", workspaceEntityId, groupId, id)
      .then()
      .statusCode(204);
  }
  
  protected WorkspaceDiscussionThread createWorkspaceDiscussionThread(Long workspaceEntityId, Long groupId, Long discussionId, String title, String message, Boolean sticky, Boolean locked) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceDiscussionThread payload = new WorkspaceDiscussionThread(null, title, message, sticky, locked);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads", workspaceEntityId, groupId, discussionId);
    
    response.then()
      .statusCode(200);
      
    WorkspaceDiscussionThread workspaceDiscussionThread = objectMapper.readValue(response.asString(), WorkspaceDiscussionThread.class);
    assertNotNull(workspaceDiscussionThread);
    assertNotNull(workspaceDiscussionThread.getId());
    
    return workspaceDiscussionThread;
  }

  protected void deleteWorkspaceDiscussionThread(Long workspaceEntityId, Long groupId, Long discussionId, Long id) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads/{ID}", workspaceEntityId, groupId, discussionId, id)
      .then()
      .statusCode(204);
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
  
  protected void switchToFrame(String selector) {
    getWebDriver().switchTo().frame(
        getWebDriver().findElementByCssSelector(selector)
    );
  }
  
  protected void switchToDefaultFrame() {
    getWebDriver().switchTo().defaultContent();
  }
  
  enum RoleType {
    PSEUDO, ENVIRONMENT, WORKSPACE
  }

  private RemoteWebDriver webDriver;
  private String sessionId;

}
