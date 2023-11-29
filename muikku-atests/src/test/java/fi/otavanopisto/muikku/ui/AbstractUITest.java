package fi.otavanopisto.muikku.ui;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static java.lang.Math.toIntExact;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.openqa.selenium.By;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.UnexpectedAlertBehaviour;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.ie.InternetExplorerOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.remote.RemoteWebDriverBuilder;
import org.openqa.selenium.safari.SafariOptions;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.deque.html.axecore.providers.FileAxeScriptProvider;
import com.deque.html.axecore.results.Results;
import com.deque.html.axecore.selenium.AxeBuilder;
import com.deque.html.axecore.selenium.AxeReporter;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.saucelabs.common.SauceOnDemandSessionIdProvider;

import fi.otavanopisto.muikku.AbstractIntegrationTest;
import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.atests.Announcement;
import fi.otavanopisto.muikku.atests.CommunicatorMessage;
import fi.otavanopisto.muikku.atests.CommunicatorUserLabelRESTModel;
import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.atests.Flag;
import fi.otavanopisto.muikku.atests.StudentFlag;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.atests.WorkspaceJournalEntry;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.model.forum.LockForumThread;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentCreatePayload;
import io.restassured.RestAssured;
import io.restassured.config.ObjectMapperConfig;
import io.restassured.http.ContentType;
import io.restassured.path.json.mapper.factory.Jackson2ObjectMapperFactory;
import io.restassured.response.Response;

public class AbstractUITest extends AbstractIntegrationTest implements SauceOnDemandSessionIdProvider {
  
  private static final long TEST_START_TIME = System.currentTimeMillis();
  
  protected static final String aXeScript = AbstractWCAGTest.class.getResource("/axe.min.js").getFile();
  
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
    case "chrome_headless":
      return TestEnvironments.Browser.CHROME_HEADLESS;
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
    String resolution = System.getProperty("it.browser.dimensions");
    if(resolution != null) {
      if (!resolution.isEmpty()) {
        String[] widthHeight = StringUtils.split(resolution, "x");
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
    RestAssured.baseURI = getAppUrl(false) + "/rest";
    RestAssured.port = getPortHttp();
//    RestAssured.authentication = certificate(getKeystoreFile(), getKeystorePass());
    RestAssured.config = RestAssured.config
      .objectMapperConfig(new ObjectMapperConfig().jackson2ObjectMapperFactory(new Jackson2ObjectMapperFactory() {
  		
        @Override
      	public ObjectMapper create(Type cls, String charset) {
      	  return new ObjectMapper()
    		    .registerModule(new JavaTimeModule())
    		    .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
      	}
    	}));
  }

  @After
  public void flushCaches() {
    asAdmin()
      .baseUri(getAppUrl(false))
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
  
  protected WebDriver createSauceWebDriver() throws MalformedURLException {
    
    final String browserVersion = getBrowserVersion();
    final String browserResolution = getBrowserResolution();
    final String platform = getSaucePlatform();
    
    Map<String, Object> sauceOptions = new HashMap<>();
    sauceOptions.put("name", getClass().getSimpleName() + ':' + testName.getMethodName());
    sauceOptions.put("tags", Arrays.asList( String.valueOf( getTestStartTime() ) ) );
    sauceOptions.put("build", getProjectVersion());
    sauceOptions.put("video-upload-on-pass", false);
    sauceOptions.put("capture-html", true);
    sauceOptions.put("timeZone", "Universal");
    sauceOptions.put("seleniumVersion", System.getProperty("it.selenium.version"));
    sauceOptions.put("username", getSauceUsername());
    sauceOptions.put("access_key", getSauceAccessKey());
    
    if (!StringUtils.isBlank(browserResolution)) {
      sauceOptions.put("screenResolution", browserResolution);
    }
 
    if (getSauceTunnelId() != null) {
      sauceOptions.put("tunnel-identifier", getSauceTunnelId());
    }
    
    RemoteWebDriverBuilder driverBuilder = RemoteWebDriver.builder();
    switch (getBrowser()) {
    case "chrome":
      driverBuilder.oneOf(new ChromeOptions().setPlatformName(platform).setBrowserVersion(browserVersion));
      break;
    case "microsoftedge":
      driverBuilder.oneOf(new EdgeOptions().setPlatformName(platform).setBrowserVersion(browserVersion));
      break;
    case "firefox":
//  TODO: When RemoteWebDriverBuilder starts to work with firefox start using this. Augmentation that builder does to the connection somehow breaks it right now for firefox.
//      driverBuilder.oneOf(new FirefoxOptions().setPlatformName(platform).setBrowserVersion(browserVersion).setAcceptInsecureCerts(true));
      FirefoxOptions browserOptions = new FirefoxOptions();
      browserOptions.setPlatformName(getSaucePlatform());
      browserOptions.setBrowserVersion(getBrowserVersion());
      browserOptions.setAcceptInsecureCerts(true);
      browserOptions.setUnhandledPromptBehaviour(UnexpectedAlertBehaviour.IGNORE);
      browserOptions.setCapability("sauce:options", sauceOptions);
      RemoteWebDriver remoteWebDriver = new RemoteWebDriver(new URL(String.format("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", getSauceUsername(), getSauceAccessKey())), browserOptions);
      remoteWebDriver.setFileDetector(new LocalFileDetector());
      return remoteWebDriver;
    case "internet explorer":
      driverBuilder.oneOf(new InternetExplorerOptions().setPlatformName(platform).setBrowserVersion(browserVersion));
      break;
    case "safari":
      driverBuilder.oneOf(new SafariOptions().setPlatformName(platform).setBrowserVersion(browserVersion));
      break;
    default:
      driverBuilder.oneOf(new ChromeOptions().setPlatformName(platform).setBrowserVersion(browserVersion));
  }

    driverBuilder.setCapability("sauce:options", sauceOptions);
    driverBuilder.address(String.format("http://%s:%s@ondemand.saucelabs.com:80/wd/hub", getSauceUsername(), getSauceAccessKey()));
    RemoteWebDriver remoteWebDriver = (RemoteWebDriver) driverBuilder.build();
    remoteWebDriver.setFileDetector(new LocalFileDetector());

    return remoteWebDriver; 

  }

  protected WebDriver createLocalDriver() {
    switch (getBrowser()) {
      case "chrome":
        return createChromeDriver();
      case "chrome_headless":
        return createChromeHeadlessDriver();
      case "firefox":
        return createFirefoxDriver();
    }
    
    throw new RuntimeException(String.format("Unknown browser %s", getBrowser()));
  }
  
  protected RemoteWebDriver createChromeDriver() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--lang=en_US");
    options.addArguments("--start-maximized");
    options.addArguments("--remote-allow-origins=*");
    ChromeDriver chromeDriver = new ChromeDriver(options);
    return chromeDriver;
  }

  protected RemoteWebDriver createFirefoxDriver() {
    FirefoxProfile firefoxProfile = new FirefoxProfile();
    FirefoxOptions firefoxOptions = new FirefoxOptions();
    firefoxOptions.setProfile(firefoxProfile);
    firefoxProfile.setPreference("intl.accept_languages", "en");
    
    if(System.getProperty("it.headless") != null) {
      firefoxOptions.setHeadless(true);
    }
    
    FirefoxDriver firefoxDriver = new FirefoxDriver(firefoxOptions);
    
    if(getBrowserDimensions() != null) {
      firefoxDriver.manage().window().setSize(new Dimension(toIntExact(getBrowserDimensions().get("width")), toIntExact(getBrowserDimensions().get("height"))));
    }else {
      firefoxDriver.manage().window().setSize(new Dimension(1280, 1024));
    }
    
    return firefoxDriver;
  }
  
  protected WebDriver createChromeHeadlessDriver() {
    ChromeOptions chromeOptions = new ChromeOptions();
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments("--disable-gpu");
    chromeOptions.addArguments("--remote-allow-origins=*");
    
    WebDriver driver = new ChromeDriver(chromeOptions);
    if(getBrowserDimensions() != null) {
      driver.manage().window().setSize(new Dimension(toIntExact(getBrowserDimensions().get("width")), toIntExact(getBrowserDimensions().get("height"))));
    }else {
      driver.manage().window().setSize(new Dimension(1280, 1024));
    }
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
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(ExpectedConditions.elementToBeClickable(locator));
  }

  protected void waitForElementToBePresent(By locator) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(30)).until(ExpectedConditions.presenceOfElementLocated(locator));
  }
  
  protected void waitForVisible(String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(30)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          WebElement element = findElement(selector);
          return element.isDisplayed();
        } catch (Exception e) {
        }
        return false;
      }
    });
    
  }
  
  protected void waitForVisibleXPath(String XPath) {
    int attempts = 0;
    while (attempts < 2) {
      try{
        new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(ExpectedConditions.visibilityOf(getWebDriver().findElement(By.xpath(XPath))));          
      }catch (StaleElementReferenceException e) {
      }      
      attempts++;
    }
  }
  
  protected void waitForUrlNotMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return !driver.getCurrentUrl().matches(regex);
      }
    });
  }

  protected void waitForUrl(final String url) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return url.equals(driver.getCurrentUrl());
      }
    });
  }

  protected void waitForUrlMatches(final String regex) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        return driver.getCurrentUrl().matches(regex);
      }
    });
  }
  
  protected String getCurrentPath() {
    String path = getWebDriver().getCurrentUrl();
    path = StringUtils.substring(path, StringUtils.lastIndexOf(path, "/"));
    return path;
  }
  
  protected void refresh() {
    getWebDriver().navigate().refresh();
  }
  
  protected void takeScreenshot() throws WebDriverException, IOException {
    takeScreenshot(new File("target", testName.getMethodName() + ".png"));
  }
  
  protected void takeScreenshot(String name) throws WebDriverException, IOException {
    takeScreenshot(new File("target", name));
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
  
  protected boolean isInOrder(List<WebElement> webElements) {
    String prev = "";
    for (WebElement webElement : webElements) {
      String current = webElement.getText();
      if(prev.compareToIgnoreCase(current) > 0) {
        return false;
      }
      prev = webElement.getText();
    }
    return true;
  }
  
  protected void assertNotPresent(String selector) {
    int size = getWebDriver().findElements(By.cssSelector(selector)).size();
    assertTrue(String.format("Unexpectedly found element %s", selector), size == 0);
  }
  
  protected void assertGoesAway(String selector, long timeOut) {
    assertTrue(new WebDriverWait(getWebDriver(), Duration.ofSeconds(timeOut)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          if (elements.isEmpty()) {
            return true;
          }
        } catch (Exception e) {
        }
        return false;
      }
    }));
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
  
  protected void waitForPresent(final String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(20)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          return !elements.isEmpty();
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }

  protected void waitForPresent(final String selector, int timeOut) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(timeOut)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          return !elements.isEmpty();
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected void waitForPresentXPath(final String xpath) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElementsXPath(xpath);
          return !elements.isEmpty();
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }

  protected void waitForNotPresent(final String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(20)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          return elements.isEmpty();
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected void waitForNotVisible(String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(ExpectedConditions.invisibilityOfElementLocated(By.cssSelector(selector)));
  }

  protected void waitForStaleness(WebElement elementToStale) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(ExpectedConditions.stalenessOf(elementToStale));
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
  
  protected void clickXPath(String xpath) {
    getWebDriver().findElement(By.xpath(xpath)).click();
  }
  
  protected void clickLinkWithText(String text) {
    getWebDriver().findElement(By.linkText(text)).click();
  }
  
  protected void waitForClickable(final String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          if (elements.size() > 0) {
            return ExpectedConditions.elementToBeClickable(elements.get(0)).apply(driver) != null;
          }
        } catch (Exception e) {
        } 
        return false;
      }
    });
  }
  
  protected void waitForClickableXPath(final String xpath) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElementsXPath(xpath);
          if (elements.size() > 0) {
            return ExpectedConditions.elementToBeClickable(elements.get(0)).apply(driver) != null;
          }
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected void waitAndClick(String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(30)).until(ExpectedConditions.elementToBeClickable(By.cssSelector(selector))).click();
  }

  protected void waitAndClick(String selector, int timeout) {
    WebDriverWait wait = new WebDriverWait(getWebDriver(), Duration.ofSeconds(timeout));
    wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(selector))).click();
  }
  
  protected void waitAndClickXPath(String xpath) {
    waitForClickableXPath(xpath);
    clickXPath(xpath);
  }
  
  /** 
   * Clicks on an selector and checks
   * if given element appears after defined (ms) interval as a result, 
   * if it doesn't, it will try again
   * number of times defined.
   * @param clickSelector String
   * @param elementToAppear String
   * @param timesToTry int
   * @param interval int
   * @return not a thing
   */
  protected void waitAndClickAndConfirm(String clickSelector, String elementToAppear, int timesToTry, int interval) {
    List<WebElement> elements = findElements(elementToAppear);
    int i = 0;
    while(elements.isEmpty()) {
      if (i > timesToTry) {
        break;
      }
      i++;
      WebDriverWait wait = new WebDriverWait(getWebDriver(), Duration.ofSeconds(10));
      wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(clickSelector))).click();
      sleep(interval);
      elements = findElements(elementToAppear);
    }
    if(elements.isEmpty())
      throw new TimeoutException("Element to appear failed to appear in a given timeout period.");
  }
  
  protected void waitAndClickAndConfirmVisible(String clickSelector, String elementToAppear, int timesToTry, int interval) {
    List<WebElement> elements = new ArrayList<WebElement>();
    int i = 0;
    while(elements.isEmpty()) {
      if (i > timesToTry) {
        break;
      }
      i++;
      WebDriverWait wait = new WebDriverWait(getWebDriver(), Duration.ofSeconds(10));
      wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(clickSelector))).click();
      sleep(interval);
      elements = findElements(elementToAppear);
      if (elements.get(0).isDisplayed()) {
        break;
      }else {
        elements.clear();
      }
    }
    if(elements.isEmpty())
      throw new TimeoutException("Element to appear failed to appear in a given timeout period.");
  }
  
  /** 
   * Clicks on an selector and checks
   * if given element is not displayed after defined (ms) interval as a result, 
   * if it is, it will try again
   * number of times defined.
   * @param clickSelector String
   * @param elementToGoAway String
   * @param timesToTry int
   * @param interval int
   * @return not a thing
   */
  protected void waitAndClickAndConfirmVisibilityGoesAway(String clickSelector, String elementToGoAway, int timesToTry, int interval) {
    List<WebElement> elements = findElements(elementToGoAway);
    int i = 0;
    while(!elements.isEmpty()) {
      if (i > timesToTry) {
        break;
      }
      if (!elements.get(0).isDisplayed()) {
        break;
      }
      i++;
      WebDriverWait wait = new WebDriverWait(getWebDriver(), Duration.ofSeconds(10));
      wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(clickSelector))).click();
      sleep(interval);
      elements = findElements(elementToGoAway);
    }
    if(!elements.isEmpty()) {
      if (elements.get(0).isDisplayed()) {
        throw new TimeoutException("Element did not go away in definded time period");
      }
    }
  }

  protected void findElementOrReloadAndFind(String elementToAppear, int timesToTry, int interval) {
    List<WebElement> elements = findElements(elementToAppear);
    int i = 0;
    while(elements.isEmpty()) {
      reloadCurrentPage();
      if (i > timesToTry) {
        break;
      }
      i++;
      sleep(interval);
      elements = findElements(elementToAppear);
    }
    if(elements.isEmpty())
      throw new TimeoutException("Element to appear failed to appear in a given timeout period.");
  }
  
  protected void waitForElementToAppear(String elementToAppear, int timesToTry, int interval) {
    List<WebElement> elements = findElements(elementToAppear);
    int i = 0;
    while(elements.isEmpty()) {
      if (i > timesToTry) {
        break;
      }
      i++;
      refresh();
      sleep(interval);
      elements = findElements(elementToAppear);
    }
    if(elements.isEmpty())
      throw new TimeoutException("Element to appear failed to appear in a given timeout period.");
  }
  
  protected void waitAndClickAndConfirmTextChanges(String clickSelector, String elementWithText, String newText, int timesToTry, int interval) {
    String text = findElement(elementWithText).getText();
    int i = 0;
    while(!StringUtils.equalsIgnoreCase(text, newText)) {
      if (i > timesToTry) {
        break;
      }
      i++;
      WebDriverWait wait = new WebDriverWait(getWebDriver(), Duration.ofSeconds(10));
      wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(clickSelector))).click();
      sleep(interval);
      waitForPresent(elementWithText);
      text = findElement(elementWithText).getText();
    }
    if(!StringUtils.equalsIgnoreCase(text, newText))
      throw new TimeoutException("Element to have new text content failed to have it in a given timeout period.");
  }
  
  protected void clickAndConfirmElementCount(String clickSelector, String elementToCountSelector, int expectedCount) {
    waitAndClick(clickSelector);
    waitForPresent(elementToCountSelector);
    int counter = 0 ;
    int elementCount = countElements(elementToCountSelector);
    while (elementCount != expectedCount) {
      waitAndClick(clickSelector);
      sleep(2000);
      waitForPresent(elementToCountSelector);
      elementCount = countElements(elementToCountSelector);
      counter++;
      if (counter > 5) {
        throw new TimeoutException("Element count not what expected within timeout period.");
      }
    }
  }
  
  protected void waitAndClickWithAction(String selector) {
    waitForPresent(selector);
    new Actions(getWebDriver()).moveToElement(getWebDriver().findElement(By.cssSelector(selector))).click().perform();    
  }

  
  protected void scrollToEnd() {
    ((JavascriptExecutor) getWebDriver()).executeScript("window.scrollTo(0, document.body.scrollHeight)");
  }
  
  protected void waitScrollAndClick(String selector) {
    waitForPresent(selector);
    scrollIntoView(selector);
    waitAndClick(selector);
  }
  
  protected void scrollIntoView(String selector) {
    waitForPresent(selector);
    ((JavascriptExecutor) getWebDriver()).executeScript(String.format("document.querySelectorAll('%s').item(0).scrollIntoView(true);", selector));
  }
  
  protected void scrollTo(String selector, int offset) {
    waitForPresent(selector);
    ((JavascriptExecutor) getWebDriver()).executeScript(String.format(""
        + "var elPos = document.querySelectorAll('%s').item(0).getBoundingClientRect().top;"
        + "var offsetPosition = elPos - %d;"
        + "window.scrollTo({ top: offsetPosition});"
        , selector, offset));
  }

  protected WebElement findElementByCssSelector(String selector) {
    return getWebDriver().findElement(By.cssSelector(selector));
  }
  
  protected void selectOption(String selector, String value){
    Select selectField = new Select(findElementByCssSelector(selector));
    selectField.selectByValue(value);
  }
  
  
  protected boolean isInSelection(String selector, String compare) {
    Select selectField = new Select(findElementByCssSelector(selector));
    List<WebElement> options = selectField.getOptions();
    for (WebElement option : options) {
      if(StringUtils.equalsIgnoreCase(option.getText(), compare)) {
        return true;
      }
    }
    return false;
  }
  
  protected void waitUntilCountOfElements(String selector, int count) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(ExpectedConditions.numberOfElementsToBe(By.cssSelector(selector), count));
  }
  
  protected void selectFinnishLocale() {
    waitForPresent("a.button-pill--current-language");
    String localeText = getElementText("a.button-pill--current-language>span");
    if(localeText.equalsIgnoreCase("EN")) {
      waitAndClick(".button-pill--current-language");
      waitAndClickAndConfirmTextChanges(".link--language-picker-dropdown .link__locale--fi", "a.button-pill--current-language>span", "fi", 3, 1500);
    }  
  }
  
  protected void selectEnglishLocale() {
    waitForPresent("a.button-pill--current-language");
    String localeText = getElementText("a.button-pill--current-language>span");
    if(localeText.equalsIgnoreCase("FI")) {
      waitAndClick(".button-pill--current-language");
      waitAndClickAndConfirmTextChanges(".link--language-picker-dropdown .link__locale--en", "a.button-pill--current-language>span", "en", 3, 1500);
    }
  }
  
  protected String getElementText(String selector) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    return element.getText();
  }
  
  protected void assertText(String selector, String text) {
    waitForPresent(selector);
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(text, element.getText());
  }

  protected void waitForContent(String selector, int timesToTry) {
    waitForPresent(selector);
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    String actual = element.getText();
    int i = 0;
    while (actual.isEmpty()) {
      if (i > timesToTry) {
        throw new TimeoutException("Element to have text content failed to have it in a given timeout period.");
      }
      i++;
      sleep(500);
      actual = getWebDriver().findElement(By.cssSelector(selector)).getText();
      
    }
  }
  
  protected void assertTextIgnoreCase(String selector, String text) {
    waitForPresent(selector);
    String actual = StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getText());
    assertEquals(StringUtils.lowerCase(text), actual);
  }

  protected void assertTextIgnoreCase(String selector, String text, int timeOut) {
    waitForPresent(selector, timeOut);
    String actual = StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getText());
    assertEquals(StringUtils.lowerCase(text), actual);
  }
  
  protected void assertTextStartsWith(String selector, String text) {
    waitForPresent(selector);
    String actual = getWebDriver().findElement(By.cssSelector(selector)).getText();
    assertTrue(StringUtils.startsWithIgnoreCase(actual, text));
  }
  
  protected void assertNotTextIgnoreCase(String selector, String text) {
    String actual = StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getText());
    assertNotEquals(text, actual);
  }
  
  protected void assertLessThan(int lessThan, int actualCount) {
    assertTrue(actualCount < lessThan);
  }
  
  protected void sendKeys(String selector, String keysToSend) {
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(keysToSend);
  }
  
  protected void clearElement(String selector) {
    getWebDriver().findElement(By.cssSelector(selector)).clear();
  }

  protected void selectAllAndClear(String selector) {
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(Keys.chord(Keys.CONTROL, "a"));
    getWebDriver().findElement(By.cssSelector(selector)).sendKeys(Keys.BACK_SPACE);
  }
  
  protected void waitUntilTextChanged(final String selector, String originalText) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          String text = getWebDriver().findElement(By.cssSelector(selector)).getText();
          return !text.equalsIgnoreCase(originalText);
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }

  protected void waitUntilHasText(final String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          waitForVisible(selector);
          String text = getWebDriver().findElement(By.cssSelector(selector)).getText();
          if(text != null) {
            return StringUtils.isBlank(text) ? false : true; 
          }
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected void waitUntilAnimationIsDone(final String selector) {
    WebDriverWait wdw = new WebDriverWait(getWebDriver(), Duration.ofSeconds(20));
    ExpectedCondition<Boolean> expectation = new ExpectedCondition<Boolean>() {
      @Override
      public Boolean apply(WebDriver driver) {
        String temp = ((JavascriptExecutor) driver).executeScript("return jQuery('" + selector + "').is(':animated')")
            .toString();
        return temp.equalsIgnoreCase("false");
      }
    };

    try {
      wdw.until(expectation);
    } catch (Exception e) {
      throw new AssertionError("Element animation is not finished in time. Css locator: " + selector);
    }
  }
  
  protected void waitUntilParentAnimationIsDone(final String selector) {
    WebDriverWait wdw = new WebDriverWait(getWebDriver(), Duration.ofSeconds(20));
    ExpectedCondition<Boolean> expectation = new ExpectedCondition<Boolean>() {
      @Override
      public Boolean apply(WebDriver driver) {
        String temp = ((JavascriptExecutor) driver).executeScript("return jQuery('" + selector + "').parent('div').is(':animated')")
            .toString();
        return temp.equalsIgnoreCase("false");
      }
    };

    try {
      wdw.until(expectation);
    } catch (Exception e) {
      throw new AssertionError("Element animation is not finished in time. Css locator: " + selector);
    }
  }
  
  protected void waitUntilContentChanged(final String selector, final String original) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, Duration.ofSeconds(30)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        String actual = StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getText());
        if (!actual.equalsIgnoreCase(original)) {
          return true;
        }
        return false;
      }
    });
  }
  
  protected void waitAndSendKeys(String selector, String keysToSend) {
    waitForPresent(selector);
    sendKeys(selector, keysToSend);
  }

  protected void waitClassPresent(final String selector, final String className) {
    WebDriver driver = getWebDriver();
    new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
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

  protected void waitForAttributeToHaveValue(final String selector, final String attribute) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          String attributeValue = getAttributeValue(selector, attribute);
          if (!attributeValue.isEmpty()) {
            return true;
          }
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected boolean waitForMoreThanSize(final String selector, final int size) {
    WebDriver driver = getWebDriver();
    return new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        int elementCount = countElements(selector);
        if (elementCount > size) {
          return true;
        }
        return false;
      }
    });
  }

  protected void waitUntilElementGoesAway(String selector, long timeOut) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(timeOut)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          List<WebElement> elements = findElements(selector);
          if (elements.isEmpty()) {
            return true;
          }
        } catch (Exception e) {
        }
        return false;
      }
    });
  }
  
  protected void tabOutOfElement(String elementToTabOutOf) {
    getWebDriver().findElement(By.cssSelector(elementToTabOutOf)).sendKeys(Keys.TAB);
  }
  
  protected void waitForValue(String selector) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          String value = getAttributeValue(selector, "value");
          if (!value.isEmpty()) {
            return true;
          }
        } catch (Exception e) {
        }
        
        return false;
      }
    });
  }
  
  protected void clickOnBullshitElement(String selector) {
    Actions action = new Actions(getWebDriver());
    action.moveToElement(getWebDriver().findElement(By.cssSelector(selector))).click().build().perform();
  }

  
  protected boolean waitUntilElementCount(final String selector, final int count) {
    WebDriver driver = getWebDriver();
    return new WebDriverWait(driver, Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        int elementCount = countElements(selector);
        if (elementCount == count) {
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
    waitForVisible(selector);
    action.moveToElement(findElementByCssSelector(selector)).perform();
  }
  
  protected void setAttributeBySelector(String selector, String attribute, String value){
    JavascriptExecutor js = (JavascriptExecutor) getWebDriver();
    String jsString = String.format("$('%s').attr('%s', '%s');", selector, attribute, value );
    js.executeScript(jsString);
  }
  
  protected void assertClassNotPresent(String selector, String className) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    String[] classes = StringUtils.split(element.getAttribute("class"), " ");
    assertFalse(String.format("Class %s present in %s", className, selector), ArrayUtils.contains(classes, className));
  }

  protected void assertClassPresent(String selector, String className) {
    waitForPresent(selector);
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    String[] classes = StringUtils.split(element.getAttribute("class"), " ");
    assertTrue(String.format("Class %s is not present in %s", className, selector), ArrayUtils.contains(classes, className));
  }

  protected void assertClassPresentXPath(String xpath, String className) {
    WebElement element = getWebDriver().findElement(By.xpath(xpath));
    String[] classes = StringUtils.split(element.getAttribute("class"), " ");
    assertTrue(String.format("Class %s is not present in element", className), ArrayUtils.contains(classes, className));
  }
    
  protected void assertValue(String selector, String value) {
    waitForPresent(selector);
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(value, element.getAttribute("value"));
  }
  
  protected void assertSelectedOption(String selector, String expected){
    Select select = new Select(findElementByCssSelector(selector));
    WebElement option = select.getFirstSelectedOption();
    String optionText = option.getText();
    assertEquals(expected, optionText);
  }
  protected void assertSelectValue(String selector, String expected){
    Select select = new Select(findElementByCssSelector(selector));
    WebElement option = select.getFirstSelectedOption();
    String optionValue = option.getAttribute("value");
    assertEquals(expected, optionValue);
  }
  protected void assertChecked(String selector, Boolean expected) {
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    assertEquals(expected, element.isSelected());
  }
  
  protected void assertCheckedXPath(String xpath, Boolean expected) {
    WebElement element = getWebDriver().findElement(By.xpath(xpath));
    assertEquals(expected, element.isSelected());
  }
  
  protected void assertElementCount(String cssSelector, int countToExpect) {
    assertEquals(countToExpect, countElements(cssSelector));
  }
  
  protected void loginAdmin() throws JsonProcessingException, Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    navigate("/login?authSourceId=1", false);
    waitForVisible(".navbar .button-pill--profile");
  }
  
  protected void login() {
    navigate("/login?authSourceId=1", false);
    waitForVisible(".navbar .button-pill--profile");
  }
  
  protected void login(String username, String password, boolean secure) {
    navigate("/login?authSourceId=1", secure);
    waitForPresent("input#username");
    waitForPresent("input#password");
    sendKeys("input#username", username);
    sendKeys("input#password", password);
    waitAndClick(".muikku-login-button");
    waitForVisible(".navbar .button-pill--profile");
  }

  protected void logout() {
    navigate("/", false);
    waitAndClick(".button-pill--profile");
    waitAndClick(".dropdown__container .icon-sign-out");
    waitForNotVisible(".dropdown__container .icon-sign-out");
    navigate("/", false);
    waitForPresent(".hero__item--frontpage", 45);
  }

  protected Workspace createWorkspace(String name, String description, String identifier, Boolean published) throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Builder mockBuilder = mocker();
    
    Course course = new CourseBuilder().name(name).id(Long.parseLong(identifier)).description(description).buildCourse();
    mockBuilder
      .addCourse(course)
      .build();
    
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
  
  protected Workspace createWorkspace(Course course, Boolean published) throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Workspace payload = new Workspace(null, course.getName(), null, "PYRAMUS", String.valueOf(course.getId()), published);
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
  
  protected DiscussionGroup createWorkspaceDiscussionGroup(Long workspaceEntityId, String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    DiscussionGroup payload = new DiscussionGroup(null, name);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups", workspaceEntityId);
    
    response.then()
      .statusCode(200);
      
    DiscussionGroup workspaceDiscussionGroup = objectMapper.readValue(response.asString(), DiscussionGroup.class);
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
  
  protected Discussion createWorkspaceDiscussion(Long workspaceEntityId, Long groupId, String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Discussion payload = new Discussion(null, name, null, groupId);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions", workspaceEntityId, groupId);
    
    response.then()
      .statusCode(200);
      
    Discussion workspaceDiscussion = objectMapper.readValue(response.asString(), Discussion.class);
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
  
  protected DiscussionThread createWorkspaceDiscussionThread(Long workspaceEntityId, Long groupId, Long discussionId, String title, String message, Boolean sticky, Boolean locked) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    DiscussionThread payload = new DiscussionThread(null, title, message, sticky, null);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEENTITYID}/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads", workspaceEntityId, groupId, discussionId);
    
    response.then()
      .statusCode(200);
      
    DiscussionThread workspaceDiscussionThread = objectMapper.readValue(response.asString(), DiscussionThread.class);
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

  protected DiscussionGroup createDiscussionGroup(String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    DiscussionGroup payload = new DiscussionGroup(null, name);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/discussiongroups");
    
    response.then()
      .statusCode(200);
      
    DiscussionGroup discussionGroup = objectMapper.readValue(response.asString(), DiscussionGroup.class);
    assertNotNull(discussionGroup);
    assertNotNull(discussionGroup.getId());
    
    return discussionGroup;
  }
  
  protected void deleteDiscussionGroup(Long groupId) {
    asAdmin()
      .delete("/test/discussiongroups/{GROUPID}", groupId)
      .then()
      .statusCode(204);
  }
  
  protected Discussion createDiscussion(Long groupId, String name) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    Discussion payload = new Discussion(null, name, null, groupId);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/discussiongroups/{GROUPID}/discussions", groupId);
    
    response.then()
      .statusCode(200);
      
    Discussion discussion = objectMapper.readValue(response.asString(), Discussion.class);
    assertNotNull(discussion);
    assertNotNull(discussion.getId());
    
    return discussion;
  }

  protected void deleteDiscussion(Long groupId, Long id) {
    asAdmin()
      .delete("/test/discussiongroups/{GROUPID}/discussions/{ID}", groupId, id)
      .then()
      .statusCode(204);
  }
  
  protected void cleanUpDiscussions() {
    asAdmin()
      .delete("/test/discussion/cleanup")
      .then()
      .statusCode(204);
  }
  
  protected DiscussionThread createDiscussionThread(Long groupId, Long discussionId, String title, String message, Boolean sticky, LockForumThread locked) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    DiscussionThread payload = new DiscussionThread(null, title, message, sticky, null);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads", groupId, discussionId);
    
    response.then()
      .statusCode(200);
      
    DiscussionThread discussionThread = objectMapper.readValue(response.asString(), DiscussionThread.class);
    assertNotNull(discussionThread);
    assertNotNull(discussionThread.getId());
    
    return discussionThread;
  }

  protected void deleteDiscussionThread(Long groupId, Long discussionId, Long id) {
    asAdmin()
      .delete("/test/discussiongroups/{GROUPID}/discussions/{DISCUSSIONID}/threads/{ID}", groupId, discussionId, id)
      .then()
      .statusCode(204);
  } 

  protected WorkspaceJournalEntry createJournalEntry(Long workspaceId, String userEmail, String html, String title) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceJournalEntry payload = new WorkspaceJournalEntry();
    payload.setWorkspaceEntityId(workspaceId);
    payload.setHtml(html);
    payload.setTitle(title);
    payload.setCreated(Date.from(Instant.now()));
    payload.setArchived(false);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/workspaces/{WORKSPACEID}/journal/{AUTHOREMAIL}", workspaceId, userEmail);
    
    response.then()
      .statusCode(200);
      
    WorkspaceJournalEntry workspaceJournalEntry = objectMapper.readValue(response.asString(), WorkspaceJournalEntry.class);
    assertNotNull(workspaceJournalEntry);
    assertNotNull(workspaceJournalEntry.getId());
    
    return workspaceJournalEntry;
  }
  
  protected void deleteJournalEntry(WorkspaceJournalEntry journalEntry) {
    asAdmin()
    .delete("/test/journal/{ID}", journalEntry.getId())
    .then()
    .statusCode(204);
  }
  
  protected void reindex() {
    asAdmin().get("/test/reindex").then().statusCode(200);    
  }

  protected void archiveUserByEmail(String email) {
    asAdmin().put("/test/users/archive/{EMAIL}", email)
    .then()
    .statusCode(200);    
  }
  
  protected void mockImport() {
    asAdmin().get("/test/mockimport").then().statusCode(200);    
  }
  
  protected void deleteWorkspace(Long id) {
    asAdmin()
      .delete("/test/workspaces/{WORKSPACEID}", id)
      .then()
      .statusCode(204);
  }
  
  protected void deleteWorkspaces() {
    asAdmin()
      .delete("/test/workspaces")
      .then()
      .statusCode(204);
  }
  
  protected WorkspaceFolder createWorkspaceFolder(Long workspaceEntityId, Long parentId, Boolean hidden, Integer orderNumber, String title, String folderType) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
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
  
  protected WorkspaceHtmlMaterial createWorkspaceHtmlMaterial(Long workspaceEntityId, Long parentId, String title, String contentType, String html, String assignmentType) throws IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    WorkspaceHtmlMaterial payload = new WorkspaceHtmlMaterial(null, parentId, title, contentType, html, assignmentType, null);
    Response response = asAdmin()
      .contentType(ContentType.JSON)
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

  protected void deleteCommunicatorUserLabels(Long userId) {
    asAdmin()
      .delete("/test/communicator/labels/user/{ID}", userId)
      .then()
      .statusCode(204);
  }
  
  protected void createCommunicatorUserLabel(Long userId, String name) {
    CommunicatorUserLabelRESTModel payload = new CommunicatorUserLabelRESTModel(null, name, 1l);
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/communicator/labels/user/{ID}", userId);
    
    response.then()
    .statusCode(200);
  }
  
  protected void createCommunicatorMesssage(String caption, String content, Long sender, Long recipient) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
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
  
  protected Long createAnnouncement(Long publisherUserEntityId, String caption, String content, Date startDate, Date endDate, Boolean archived, Boolean publiclyVisible, List<Long> userGroupIds, List<Long> workspaceEntityIds) throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Announcement payload = new Announcement(null, publisherUserEntityId, userGroupIds, workspaceEntityIds, caption, content, new Date(), startDate, endDate, archived, publiclyVisible);                 
    Response response = asAdmin()
      .contentType("application/json")
      .body(payload)
      .post("/test/announcements");
    
    response.then()
      .statusCode(200);
    
    Long result = objectMapper.readValue(response.asString(), Long.class);
    return result;
  }
  
  protected void updateAnnouncementWorkspace(Long announcementId, Long workspaceId) {
    asAdmin()
      .put("/test/announcements/{ANNOUNCEMENTID}/workspace/{WORKSPACEID}", String.valueOf(announcementId), String.valueOf(workspaceId))
      .then()
      .statusCode(200);
  }
  
  protected long fetchUserIdByEmail(String email) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Response response = asAdmin()
        .contentType("application/json")
        .get("/test/users/id/{EMAIL}", email);
      
      response.then()
        .statusCode(200);
      
      Long result = objectMapper.readValue(response.asString(), Long.class);
      return result;
  }
  
  protected void deleteUserGroup(Long userGroupId) {
    asAdmin()
      .delete("/test/userGroups/{USERGROUPID}", userGroupId)
      .then()
      .statusCode(204);
  }

  protected void deleteUserGroups() {
    asAdmin()
      .delete("/test/userGroups")
      .then()
      .statusCode(204);
  }
  
  protected void deleteUserGroupUser(Long userGroupId, Long userId) {
    asAdmin()
      .delete("test/userGroups/{USERGROUPID}/{USERID}", userGroupId, userId)
      .then()
      .statusCode(204);
  }
  
  protected void deleteUserGroupUsers() {
    asAdmin()
      .delete("test/userGroups/users")
      .then()
      .statusCode(204);
  }

  protected void createPasswordChange(String email) throws Exception {
    asAdmin()
      .contentType(ContentType.JSON)
      .body("{}")
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
  
  protected Long createFlag(String name, String color, String description) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Flag flag = new Flag(null, name, color, description, "STAFF-1/PYRAMUS");
    Response response = asAdmin()
    .contentType("application/json")
    .body(flag)
    .post("/test/flags");
    
    response.then()
      .statusCode(200);
    
    Flag result = objectMapper.readValue(response.asString(), Flag.class);
    return result.getId();
  }
  
  protected void deleteFlags() {
    asAdmin()
      .delete("/test/flags")
      .then()
      .statusCode(204);
  }
  
  protected void deleteFlag(Long flagId) {
    asAdmin()
      .delete("/test/flags/{FLAGID}", flagId)
      .then()
      .statusCode(204);
  }
  
  protected void deleteFlagShares(Long flagId) {
    asAdmin()
    .delete("/test/flags/share/{FLAGID}", flagId)
    .then()
    .statusCode(204);
  }
  
  protected void deleteStudentFlag(Long studentFlagId) {
    asAdmin()
    .delete("/test/students/flags/{ID}", studentFlagId)
    .then()
    .statusCode(204);
  } 
  
  protected Long flagStudent(Long studentId, Long flagId) throws JsonParseException, JsonMappingException, IOException {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    Response response = asAdmin()
      .contentType("application/json")
      .body("{}")
      .post("/test/students/{ID}/flags/{FLAGID}", studentId, flagId);
    
    response.then()
      .statusCode(200);
    
    StudentFlag result = objectMapper.readValue(response.asString(), StudentFlag.class);
    return result.getId();
  }
  
  protected String getAttributeValue(String selector, String attribute){
    waitForPresent(selector);
    WebElement element = getWebDriver().findElement(By.cssSelector(selector));
    return element.getAttribute(attribute);

  }
  
  protected void waitUntilValueChanges(String selector, String attribute, String originalValue){
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        String actual = StringUtils.lowerCase(getWebDriver().findElement(By.cssSelector(selector)).getAttribute(attribute));
        if (!actual.equalsIgnoreCase(originalValue)) {
          return true;
        }
        return false;
      }
    });
  }
  
  protected WebElement findElementByTag(String name) {
    return getWebDriver().findElement(By.tagName(name));
  }
  
  protected String getCKEditorContentIFrame() {
    getWebDriver().switchTo().frame(findElementByCssSelector(".cke_wysiwyg_frame"));
    String ckeContent = findElementByTag("body").getText();
    getWebDriver().switchTo().defaultContent();
    return ckeContent;
  }
  
  protected String getVisibleCKEditorContentInMaterials() {
    waitForPresent(".cke_wysiwyg_div p");
    List<WebElement> elements = findElements(".cke_wysiwyg_div p");
    String ckeContent = "";
    for (WebElement webElement : elements) {
      if(webElement.isDisplayed()) {
        ckeContent = webElement.getText();
      }
        
    }
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

  protected void dragAndDropXPath(String source, String target, int x, int y) {
    WebElement sourceElement = findElementXPath(source); 
    WebElement targetElement = findElementXPath(target);
    (new Actions(getWebDriver()))
    .clickAndHold(sourceElement)
    .moveToElement(targetElement, x, y)
    .build()
    .perform();
    sleep(500);
    (new Actions(getWebDriver()))
      .release()
      .build()
      .perform();  
  }
  
  protected void dragAndDropWithOffSetAndTimeout(String source, String target, int x, int y){  
    WebElement sourceElement = findElement(source); 
    WebElement targetElement = findElement(target);
    (new Actions(getWebDriver()))
      .clickAndHold(sourceElement)
      .moveToElement(targetElement, x, y)
      .build()
      .perform();
    sleep(500);
    (new Actions(getWebDriver()))
      .release()
      .build()
      .perform();
  }
  
  protected void addToEndCKEditor(String text) {
    waitForVisible(".cke_contents");
    waitAndClick(".cke_contents");
    Actions action = new Actions(getWebDriver());
    action.sendKeys(getWebDriver().findElement(By.cssSelector(".cke_wysiwyg_div")), Keys.CONTROL)
      .sendKeys(getWebDriver().findElement(By.cssSelector(".cke_wysiwyg_div")), Keys.END).perform();
    sendKeys(".cke_wysiwyg_div", text);
  }
  
  protected void addTextToCKEditor(String text) {
    waitForPresent(".cke_contents");
    if (StringUtils.equals(getBrowser(), "phantomjs") ) {
      waitForCKReady("textContent");
      ((JavascriptExecutor) getWebDriver()).executeScript("CKEDITOR.instances.textContent.setData('"+ text +"');");
    } else {
      waitAndClick(".cke_contents");
      sendKeys(".cke_wysiwyg_div", text);
    }
  }

  protected void addTextToCKEditor(String selector, String text) {
    waitForVisible(selector + " .cke_contents");
    waitAndClick(selector + " .cke_contents");
    sendKeys(selector + " .cke_wysiwyg_div", text);
  }

  protected void clearCKEditor(String selector) {
    waitForVisible(selector + " .cke_contents");
    waitAndClick(selector + " .cke_contents");
    selectAllAndClear(selector + " .cke_wysiwyg_div");
  } 
  
  protected void setTextAreaText(String selector, String value) {
    JavascriptExecutor js = (JavascriptExecutor) getWebDriver();
    String jsString = String.format("$('%s').html('%s');", selector, value );
    js.executeScript(jsString);
  }

  protected void waitForCKReady() {
    String instanceName = getAttributeValue("textarea.cke", "name");
    waitForCKReady(instanceName);
  }
  
  protected void waitForCKReady(final String instanceName) {
    new WebDriverWait(getWebDriver(), Duration.ofSeconds(60)).until(new ExpectedCondition<Boolean>() {
      public Boolean apply(WebDriver driver) {
        try {
          return ((JavascriptExecutor) driver)
              .executeScript(String.format("return CKEDITOR.instances['%s'] ? CKEDITOR.instances['%s'].status : 'null'", instanceName, instanceName))
              .equals("ready");
        } catch (Exception e) {
          return false;
        }
      }
    });
  }

  protected WebElement findElement(String selection) {
    return getWebDriver().findElement(By.cssSelector(selection));
  }

  protected WebElement findElementXPath(String xpath) {
    return getWebDriver().findElement(By.xpath(xpath));
  }
  
  protected List<WebElement> findElements(String selector){
    try {
      return getWebDriver().findElements(By.cssSelector(selector));
    } catch (Exception e) {
      return new ArrayList<WebElement>();
    }
  }
  
  protected List<WebElement> findElementsXPath(String xpath){
    try {
      return getWebDriver().findElements(By.xpath(xpath));
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
    
  protected void updateWorkspaceAccessInUI(String workspaceAccess, Workspace workspace) {
    navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
    scrollTo("input#" + workspaceAccess, 300);
    sleep(500);
    waitAndClick("input#" + workspaceAccess);
    scrollIntoView(".button--primary-function-save");
    sleep(500);
    waitAndClick(".button--primary-function-save");
    waitForPresent(".notification-queue__item--success");
    sleep(500);
  }
  
  protected void reportWCAG() {
    if (this.violationList != null) {
      if (!this.violationList.isEmpty()) {
        String violationsString = "";
        for (String violation : violationList) {
          violationsString += System.getProperty("line.separator");
          violationsString += violation;
          violationsString += System.getProperty("line.separator");          
        }
        assertTrue(violationsString, false);
      }
    }
  }

  protected void testAccessibility(String testView) throws FileNotFoundException {
    if (this.violationList == null) {
      this.violationList = new ArrayList<String>();
    }
    List<String> disableRules  = new ArrayList<String>();
    disableRules.add("color-contrast");
    
    FileAxeScriptProvider axeScriptProvider = new FileAxeScriptProvider(aXeScript);
    AxeBuilder axeBuilder = new AxeBuilder();
    axeBuilder.disableRules(disableRules);
    axeBuilder.setAxeScriptProvider(axeScriptProvider);
    Results results = axeBuilder.analyze(getWebDriver());

    if(AxeReporter.getReadableAxeResults(testView, getWebDriver(), results.getViolations())) {
      this.violationList.add(AxeReporter.getAxeResultString()); 
    }
  }
  
  enum RoleType {
    PSEUDO, ENVIRONMENT, WORKSPACE
  }
  
  private String sessionId;
  private WebDriver webDriver;
  protected List<String> violationList;
  
}
