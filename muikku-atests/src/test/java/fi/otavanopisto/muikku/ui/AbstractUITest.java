package fi.otavanopisto.muikku.ui;

import static com.jayway.restassured.RestAssured.certificate;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;
import com.jayway.restassured.response.Response;
import com.saucelabs.common.SauceOnDemandSessionIdProvider;

import fi.otavanopisto.muikku.AbstractIntegrationTest;
import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Announcement;
import fi.otavanopisto.muikku.atests.CommunicatorMessage;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceDiscussion;
import fi.otavanopisto.muikku.atests.WorkspaceDiscussionGroup;
import fi.otavanopisto.muikku.atests.WorkspaceDiscussionThread;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentCreatePayload;
import wiremock.org.apache.commons.lang.StringUtils;

public class AbstractUITest extends AbstractIntegrationTest implements SauceOnDemandSessionIdProvider {
  
  private static final long TEST_START_TIME = System.currentTimeMillis();
  
  @Rule
  public WireMockRule wireMockRule = new WireMockRule(Integer.parseInt(System.getProperty("it.wiremock.port")));
    
  @Rule
  public TestWatcher testWatcher = new TestWatcher() {
    
    protected void finished(Description description) {
      try {
        getWebDriver().quit();      
      } catch (Exception e) {
      }
    }
  
    @Override
    public Statement apply(Statement base, Description description) {
      boolean browserSkip = false;
      boolean resolutionSkip = false;
      
      for (Annotation annotation : description.getAnnotations()) {
        if (annotation instanceof TestEnvironments) {
          TestEnvironments testEnvironments = (TestEnvironments) annotation;
          if (testEnvironments.browsers().length > 0) {
            if (getTestEnvBrowser() != null) {
              browserSkip = true;
            
              for (TestEnvironments.Browser browser : testEnvironments.browsers()) {
                if (getTestEnvBrowser().equals(browser)) {
                  browserSkip = false;
                  break;
                } 
              }
            }
          }
          if(testEnvironments.screenSizes().length > 0) {
            if (getScreenSize() != null) {
              resolutionSkip = true;
              for (TestEnvironments.ScreenSize screenSize : testEnvironments.screenSizes()) {
                if (getScreenSize().equals(screenSize)) {
                  resolutionSkip = false;
                  break;
                } 
              }
            } 
          }
        }
      }
      
      if (!browserSkip && !resolutionSkip) {
        return super.apply(base, description);
      }
      
      return new Statement() {
        @Override
        public void evaluate() throws Throwable {
        }
      };
    }
      
    @Override
    protected void failed(Throwable e, Description description) {
      try {
        takeScreenshot();
      } catch (IOException e1) {
        e1.printStackTrace();
      }
    }
    
  };
  
  protected TestEnvironments.Browser getTestEnvBrowser() {
    switch (getBrowser()) {
    case "internet explorer":
      return TestEnvironments.Browser.INTERNET_EXPLORER;
    case "microsoftedge":
      return TestEnvironments.Browser.EDGE;
    case "firefox":
      return TestEnvironments.Browser.FIREFOX;
    case "safari":
      return TestEnvironments.Browser.SAFARI;
    case "chrome":
      return TestEnvironments.Browser.CHROME;
    case "phantomjs":
      return TestEnvironments.Browser.PHANTOMJS;
    default:
      return null;
    } 
  }
  
  protected TestEnvironments.ScreenSize getScreenSize() {
    Map<String, Long> dimensions = getBrowserDimensions();
    if (dimensions != null) {
      Long width = dimensions.get("width");
      if (width != null) {
        if (width > 1099) {
          return TestEnvironments.ScreenSize.LARGE;
        }
        if (768 < width && width < 1099) {
          return TestEnvironments.ScreenSize.MEDIUM;
        }
        if (width < 768) {
          return TestEnvironments.ScreenSize.SMALL;
        }
      }  
    }
    return null;
  }
  
  protected Map<String, Long> getBrowserDimensions() {
    String resolution = System.getProperty("it.sauce.browser.resolution");
    if(resolution != null) {
      if (!resolution.isEmpty()) {
        String[] widthHeight = org.apache.commons.lang3.StringUtils.split(resolution, "x");
        Map<String, Long> dimensions = new HashMap<String, Long>();
        dimensions.put("width", Long.parseLong(widthHeight[0]));
        dimensions.put("height", Long.parseLong(widthHeight[1]));  
        return dimensions;
      } 
    }
    return null;
  }
  
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
  public void flushCaches() {
    asAdmin()
      .baseUri(getAppUrl(true))
      .get("/system/cache/flush");
  }
  

  @Override
  public String getSessionId() {
    return sessionId;
  }
  

  protected void setWebDriver(WebDriver webDriver) {
    this.webDriver = webDriver;
    
    if (webDriver instanceof RemoteWebDriver) {
      this.sessionId = ((RemoteWebDriver) webDriver).getSessionId().toString();
    }
  }
  
  protected WebDriver getWebDriver() {
    return webDriver;
  }

  protected String getBrowser() {
    String browser = System.getProperty("it.browser");
    if (browser != null) {
      return browser;
    }
    return "";
  }
  
  protected String getBrowserVersion() {
    return System.getProperty("it.browser.version");
  }
  
  protected String getBrowserResolution() {
    return System.getProperty("it.browser.resolution");
  }
  
  protected String getSaucePlatform() {
    return System.getProperty("it.platform");
  }
  
  protected RemoteWebDriver createSauceWebDriver() throws MalformedURLException {
    final DesiredCapabilities capabilities = new DesiredCapabilities();
    final String seleniumVersion = System.getProperty("it.selenium.version");
    
    final String browser = getBrowser();
    final String browserVersion = getBrowserVersion();
    final String browserResolution = getBrowserResolution();
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
    
    RemoteWebDriver remoteWebDriver = new RemoteWebDriver(new URL(String.format("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", getSauceUsername(), getSauceAccessKey())), capabilities);
    
    remoteWebDriver.setFileDetector(new LocalFileDetector());

    return remoteWebDriver; 

  }
  
  protected RemoteWebDriver createChromeDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--lang=en_US");
    options.addArguments("--start-maximized");
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
  

  protected WebDriver createLocalDriver() {
    switch (getBrowser()) {
      case "chrome":
        return createChromeDriver();
      case "phantomjs":
        return createPhantomJsDriver();
      case "firefox":
        return createFirefoxDriver();
    }
    
    throw new RuntimeException(String.format("Unknown browser %s", getBrowser()));
  }
  
  protected WebDriver createPhantomJsDriver() {
    DesiredCapabilities desiredCapabilities = DesiredCapabilities.phantomjs();
    desiredCapabilities.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, ".phantomjs/bin/phantomjs");
    desiredCapabilities.setCapability(PhantomJSDriverService.PHANTOMJS_PAGE_CUSTOMHEADERS_PREFIX + "Accept-Language", "fi_FI");
    desiredCapabilities.setCapability(PhantomJSDriverService.PHANTOMJS_CLI_ARGS, new String[] { "--ignore-ssl-errors=true", "--webdriver-loglevel=NONE", "--load-images=false" } );
    PhantomJSDriver driver = new PhantomJSDriver(desiredCapabilities);
    driver.manage().window().setSize(new Dimension(1280, 1024));
    return driver;
  }
  
  public static long getTestStartTime() {
    return TEST_START_TIME;
  }

  protected void testTitle(String path, String expected) {
    getWebDriver().get(getAppUrl(true) + path);
    assertEquals(expected, getWebDriver().getTitle());
  }

  protected void reloadCurrentPage() {
    getWebDriver().get(getWebDriver().getCurrentUrl());
  }
  
  protected void testPageElementsByName(String elementName) {
    Boolean elementExists = getWebDriver().findElements(By.name(elementName)).size() > 0;
    assertEquals(true, elementExists);
  }

  protected void waitForElementToBeClickable(String selector){
    waitForElementToBeClickable(By.cssSelector(selector));
  }
  
  protected void waitForElementToBeClickable(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.elementToBeClickable(locator));
  }

  protected void waitForElementToBePresent(By locator) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.presenceOfElementLocated(locator));
  }
  
  protected void waitForVisible(String selector) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.visibilityOf(getWebDriver().findElement(By.cssSelector(selector))));    
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

  protected void waitForPresentAndVisible(String selector) {
    waitForPresent(selector);
    assertVisible(selector);
  }
   
  protected void takeScreenshot() throws WebDriverException, IOException {
    takeScreenshot(new File("target", testName.getMethodName() + ".png"));
  }
  
  protected void takeScreenshot(File file) throws WebDriverException, IOException {
    if (webDriver instanceof TakesScreenshot) {
      FileOutputStream fileOuputStream = new FileOutputStream(file);
      try {
       fileOuputStream.write(((TakesScreenshot) webDriver).getScreenshotAs(OutputType.BYTES));
      } finally {
        fileOuputStream.flush();
        fileOuputStream.close();
      }
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
    waitForPresent(selector);
    assertTrue(String.format("Could not find element %s", selector), getWebDriver().findElements(By.cssSelector(selector)).size() > 0);
  }
  
  protected void assertNotPresent(String selector) {
    int size = getWebDriver().findElements(By.cssSelector(selector)).size();
    assertTrue(String.format("Unexpectedly found element %s", selector), size == 0);
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
  
  protected void assertCount(String selector, int expectedCount) {
    int count = 0;
    
    count = getWebDriver().findElements(By.cssSelector(selector)).size();

    assertEquals(expectedCount, count);
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

  protected void waitForNotVisible(String selector) {
    new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(selector)));
  }
  
  protected boolean isElementPresent(String selector) {
    try {
      getWebDriver().findElement(By.cssSelector(selector));
      return true;
    } catch (org.openqa.selenium.NoSuchElementException e) {
      return false;
    }
  }

  
  protected void click(String selector) {
    getWebDriver().findElement(By.cssSelector(selector)).click();
  }

  protected void waitForClickable(String selector){
    waitForPresent(selector);
  }
  
  protected void waitAndClick(String selector) {
    waitForPresent(selector);
    if(getWebDriver().findElement(By.cssSelector(selector)).isEnabled()){
      new WebDriverWait(getWebDriver(), 60).until(ExpectedConditions.elementToBeClickable(By.cssSelector(selector)));
      click(selector);
    }
  }
  
  protected void waitScrollAndClick(String selector) {
    waitForPresent(selector);
    scrollIntoView(selector);
    waitAndClick(selector);
  }
  
  protected void scrollIntoView(String selector) {
    ((JavascriptExecutor) getWebDriver()).executeScript(String.format("document.querySelectorAll('%s').item(0).scrollIntoView(true);", selector));
  }

  protected WebElement findElementByCssSelector(String selector) {
    return getWebDriver().findElement(By.cssSelector(selector));
  }
  
  protected void selectOption(String selector, String value){
    Select selectField = new Select(findElementByCssSelector(selector));
    selectField.selectByValue(value);
  }
  
  protected void assertText(String selector, String text) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(text, element.getText());
  }


  protected void assertTextIgnoreCase(String selector, String text) {
    assertEquals(StringUtils.lowerCase(text), StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getText()));
  }
  
  protected void sendKeys(String selector, String keysToSend) {
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(keysToSend);
  }
  
  protected void clearElement(String selector) {
    getWebDriver().findElement(By.cssSelector(selector)).clear();
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

  protected boolean waitForMoreThanSize(final String selector, final int size) {
    WebDriver driver = getWebDriver();
    return new WebDriverWait(driver, 60).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        int elementCount = countElements(selector);
        if (elementCount > size) {
          return true;
        }
        return false;
      }
    });
  }
  
  protected int countElements(String selector) {
    List<WebElement> elements = getWebDriver().findElements(By.cssSelector(selector));
    return elements.size();
  }
  
  protected void hoverOverElement(String selector) {
    Actions action = new Actions(getWebDriver());
    action.moveToElement(findElementByCssSelector(selector)).perform();
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
    Select select = new Select(findElementByCssSelector(selector));
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
    PyramusMocks.personsPyramusMocks();
    navigate("/login?authSourceId=1", true);
    waitForPresent("main.content");
  }
  
  protected void login() {
    navigate("/login?authSourceId=1", true);
    waitForPresent(".logged-user");
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
  
  protected void logout() {
    navigate("/", true);
    waitAndClick("a.lu-action-signout");
    waitForPresent("body");    
  }
  
  protected Workspace createWorkspace(String name, String description, String identifier, Boolean published) throws Exception {
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
      .contentType("application/json;charset=UTF-8")
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
  
  protected void deleteCommunicatorMessages() {
    asAdmin()
      .delete("/test/communicator/messages")
      .then()
      .statusCode(204);
  }
  
  protected void createCommunicatorMesssage(String caption, String content, Long sender, Long recipient) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Date created = new Date();
    Set<String> tags = new HashSet<>();
    List<Long> recipientIds = new ArrayList<>();
    recipientIds.add(recipient);
    CommunicatorMessage payload = new CommunicatorMessage(null, null, sender, "test", caption, content, created, tags, recipientIds, new ArrayList<Long>(), new ArrayList<Long>(), new ArrayList<Long>());

    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("test/communicator/messages");
    
    response.then()
      .statusCode(200);
      
    CommunicatorMessage result = objectMapper.readValue(response.asString(), CommunicatorMessage.class);
    assertNotNull(result);
    assertNotNull(result.getId());
  }
  
  protected void deleteAnnouncements() {
    asAdmin()
      .delete("/test/announcements")
      .then()
      .statusCode(204);
  }
  
  protected void createAnnouncement(Long publisherUserEntityId, String caption, String content, Date startDate, Date endDate, Boolean archived, Boolean publiclyVisible, List<Long> userGroupIds) throws Exception {
    Announcement payload = new Announcement(null, publisherUserEntityId, userGroupIds, caption, content, new Date(), startDate, endDate, archived, publiclyVisible);                 
    asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/announcements");
  }
  
  protected void deleteUserGroup(Long userGroupId) {
    asAdmin()
      .delete("/test/userGroups/{USERGROUPID}", userGroupId)
      .then()
      .statusCode(204);
  }
  
  protected void deleteUserGroupUser(Long userGroupId, Long userId) {
    asAdmin()
      .delete("test/userGroups/{USERGROUPID}/{USERID}", userGroupId, userId)
      .then()
      .statusCode(204);
  }

  protected void createPasswordChange(String email) throws Exception {
    asAdmin()
      .post("/test/passwordchange/{EMAIL}", email)
      .then()
      .statusCode(204);
  }
  
  protected void deletePasswordChange(String email) {
    asAdmin()
      .delete("/test/passwordchange/{EMAIL}", email)
      .then()
      .statusCode(204);
  }
  
  protected String getAttributeValue(String selector, String attribute){
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    return element.getAttribute(attribute);

  }
  
  protected WebElement findElementByTag(String name) {
    return getWebDriver().findElement(By.tagName(name));
  }
  
  protected String getCKEditorContent() {
    getWebDriver().switchTo().frame(findElementByCssSelector(".cke_wysiwyg_frame"));
    String ckeContent = findElementByTag("body").getText();
    getWebDriver().switchTo().defaultContent();
    return ckeContent;
  }
  
  protected void dragAndDrop(String source, String target){
    if (StringUtils.equals(getBrowser(), "microsoftedge") || StringUtils.equals(getBrowser(), "internet explorer") || StringUtils.equals(getBrowser(), "safari")) {
      ((JavascriptExecutor) getWebDriver())
        .executeScript(String.format("try { $('%s').simulate('drag-n-drop', { dragTarget: $('%s') }); } catch (e) { console.log(e); } ", source, target ));
    } else {     
      WebElement sourceElement = findElement(source); 
      WebElement targetElement = findElement(target);
      
      (new Actions(getWebDriver()))
        .dragAndDrop(sourceElement, targetElement)
        .perform();
    }
  }
  
  protected void addTextToCKEditor(String text) {
    waitForPresent(".cke_wysiwyg_frame");
    if (StringUtils.equals(getBrowser(), "phantomjs") ) {
      ((JavascriptExecutor) getWebDriver()).executeScript("CKEDITOR.instances.textContent.setData('"+ text +"');");
    } else {
      waitAndClick("#cke_1_contents");
      getWebDriver().switchTo().activeElement().sendKeys(text);
    }
  }
  
  protected WebElement findElement(String selection) {
    return getWebDriver().findElement(By.cssSelector(selection));
  }
  
  protected List<WebElement> findElements(String selector){
    try {
      return getWebDriver().findElements(By.cssSelector(selector));
    } catch (Exception e) {
      return new ArrayList<WebElement>();
    }
  }
  
  protected void switchToFrame(String selector) {
    getWebDriver().switchTo().frame(
      findElementByCssSelector(selector)
    );
  }
  
  protected void switchToDefaultFrame() {
    getWebDriver().switchTo().defaultContent();
  }
  
  enum RoleType {
    PSEUDO, ENVIRONMENT, WORKSPACE
  }

  private String sessionId;
  private WebDriver webDriver;

}
