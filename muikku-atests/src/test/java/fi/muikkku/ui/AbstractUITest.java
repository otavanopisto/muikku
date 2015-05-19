package fi.muikkku.ui;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.matching;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;
import static com.jayway.restassured.RestAssured.certificate;
import static com.jayway.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Rule;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;

import fi.muikku.AbstractIntegrationTest;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.WhoAmI;

public class AbstractUITest extends AbstractIntegrationTest {

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

  @Before
  public void createAdminAccessToken() {
    Response response = given().contentType("application/json").get("/test/login?role=" + getFullRoleName(RoleType.ENVIRONMENT, "ADMINISTRATOR"));

    String adminAccessToken = response.getCookie("JSESSIONID");
    setAdminAccessToken(adminAccessToken);

    // System.out.println("Admin accesstoken: " + adminAccessToken);
  }

  public String getAdminAccessToken() {
    return adminAccessToken;
  }

  public void setAdminAccessToken(String adminAccesToken) {
    this.adminAccessToken = adminAccesToken;
  }

  public RequestSpecification asAdmin() {
    RequestSpecification reSpect = RestAssured.given();
    if (adminAccessToken != null) {
      // System.out.println("Setting request cookie: " + adminAccessToken);
      reSpect = reSpect.cookie("JSESSIONID", adminAccessToken);
    }

    return reSpect;
  }

  protected void setWebDriver(RemoteWebDriver webDriver) {
    this.webDriver = webDriver;
  }

  protected RemoteWebDriver getWebDriver() {
    return webDriver;
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
    Date dNow = new Date();
    SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd-hh:mm:ss");
    File screenshot = ((TakesScreenshot) getWebDriver()).getScreenshotAs(OutputType.FILE);
    FileUtils.copyFile(screenshot, new File(System.getProperty("it.report.directory") + ft.format(dNow) + "-" + testName.getMethodName() + ".png"));
  }

  protected void sleep(long millis) {
    try {
      Thread.sleep(millis);
    } catch (InterruptedException e) {
    }
  }
  
  protected void studentPyramusLoginMocks() throws JsonProcessingException {
    stubFor(get(urlMatching("/dnm")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/users/authorize.*"))
      .willReturn(aResponse()
        .withStatus(302)
        .withHeader("Location",
          "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlMatching("/1/oauth/token"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    List<String> emails = new ArrayList<String>();
    emails.add("testuser@made.up");
    WhoAmI whoAmI = new WhoAmI((long) 1, "Test", "User", emails);

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);

    stubFor(get(urlMatching("/1/system/whoami"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));

    Map<String, String> variables = null;
    List<String> tags = null;
    Student student = new Student((long) 1, (long) 1, "Test", "User", null, null, null, null, null, null, null, null, null, null, null, (long) 1, null, null,
      false, null, null, null, null, variables, tags, false);
    String studentJson = objectMapper.writeValueAsString(student);

    stubFor(get(urlMatching("/1/students/students/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentJson)
        .withStatus(200)));

    Email email = new Email((long) 1, (long) 2, true, "testuser@made.up");
    String emailJson = objectMapper.writeValueAsString(email);
    stubFor(get(urlMatching("/1/students/students/.*/emails"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(emailJson).withStatus(200)));

    Student[] studentArray = { student };
    String studentArrayJson = objectMapper.writeValueAsString(studentArray);
    stubFor(get(urlEqualTo("/1/students/students?email=testuser@made.up"))
    // .withQueryParam("email", matching(".*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));

    DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);

    Person person = new Person((long) 1, birthday, "345345-3453", fi.pyramus.rest.model.Sex.MALE, false, "empty", (long) 1);
    String personJson = objectMapper.writeValueAsString(person);
    stubFor(get(urlMatching("/1/persons/persons/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(personJson)
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/students/students?filterArchived=false&firstResult=0&maxResults=100"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(studentArrayJson)
        .withStatus(200)));

    StaffMember staffMember = new StaffMember((long) 5, (long) 5, null, "Test", "Staffmember", null, fi.pyramus.rest.model.UserRole.ADMINISTRATOR, tags,
      variables);
    StaffMember[] staffArray = { staffMember };
    String staffArrayJson = objectMapper.writeValueAsString(staffArray);

    stubFor(get(urlMatching("/1/staff/members"))
      .withQueryParam("email", matching("staff@made.up"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(staffArrayJson)
        .withStatus(200)));

    stubFor(get(urlMatching("/1/courses/staffMemberRoles")).willReturn(aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/1/courses/courses/.*/students?filterArchived=false")).willReturn(
      aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));

    stubFor(get(urlMatching("/1/courses/courses/.*/staffMembers")).willReturn(
      aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));
  }

  protected static String getFullRoleName(RoleType roleType, String role) {
    // System.out.println(roleType + " ----- " + role);
    return roleType.name() + "-" + role;
  }

  enum RoleType {
    PSEUDO, ENVIRONMENT, WORKSPACE
  }

  private String adminAccessToken;

  private RemoteWebDriver webDriver;
}