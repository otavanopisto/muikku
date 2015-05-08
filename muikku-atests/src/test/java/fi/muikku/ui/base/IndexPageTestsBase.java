package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;

import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Person;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.StaffMember;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.WhoAmI;

public class IndexPageTestsBase extends AbstractUITest {

  @Before
  public void requiredPyramusMocks() throws JsonProcessingException {
    
    stubFor(get(urlMatching("/dnm"))
      .willReturn(
        aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("")
        .withStatus(204)));
    
    stubFor(get(urlMatching("/users/authorize.*"))
//     .withQueryParam("client_id", matching("*"))
//     .withQueryParam("response_type", matching("*"))
//     .withQueryParam("redirect_uri", matching("*"))
      .willReturn(
        aResponse()
          .withStatus(302)
//          .withHeader("Content-Length", "0")
          .withHeader("Location", "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));
   
    stubFor(post(urlMatching("/1/oauth/token")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));
    
    List<String> emails = new ArrayList<String>();
    emails.add("testuser@made.up");
    WhoAmI whoAmI = new WhoAmI((long)1, "Test", "User", emails);

    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String whoAmIJson = objectMapper.writeValueAsString(whoAmI);
    
    stubFor(get(urlMatching("/1/system/whoami")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody(whoAmIJson)
        .withStatus(200)));

    Map<String, String> variables = null;
    List<String> tags = null;
    Student student = new Student((long) 1, (long) 1, "Test", "User", null, null, null, null, null, null, null, null, null, null, null,
      (long) 1, null, null, false, null, null, null, null, variables, tags, false);
    String studentJson = objectMapper.writeValueAsString(student);
    
    stubFor(get(urlMatching("/1/students/students/.*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(studentJson)
          .withStatus(200)));

    Email email = new Email((long) 1, (long) 2, true, "testuser@made.up"); 
    String emailJson = objectMapper.writeValueAsString(email);
    stubFor(get(urlMatching("/1/students/students/.*/emails")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody(emailJson)
        .withStatus(200)));
    
    Student[] studentArray = {student};
    String studentArrayJson = objectMapper.writeValueAsString(studentArray);
    stubFor(get(urlEqualTo("/1/students/students?email=testuser@made.up"))
    // .withQueryParam("email", matching(".*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(studentArrayJson)
          .withStatus(200)));

    DateTime birthday = new DateTime(1990, 2, 2, 0, 0, 0, 0);

    Person person = new Person((long) 1, birthday, "345345-3453", fi.pyramus.rest.model.Sex.MALE, false, "empty", (long) 1);
    String personJson = objectMapper.writeValueAsString(person);
    stubFor(get(urlMatching("/1/persons/persons/.*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(personJson)
          .withStatus(200)));

    stubFor(get(urlEqualTo("/1/students/students?filterArchived=false&firstResult=0&maxResults=100"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(studentArrayJson)
          .withStatus(200)));
    
    StaffMember staffMember = new StaffMember((long) 5, (long) 5, null, "Test", "Staffmember", null, fi.pyramus.rest.model.UserRole.ADMINISTRATOR, tags, variables);
    StaffMember[] staffArray = {staffMember};
    String staffArrayJson = objectMapper.writeValueAsString(staffArray);
    
    stubFor(get(urlMatching("/1/staff/members"))
      .withQueryParam("email", matching("staff@made.up"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody(staffArrayJson)
          .withStatus(200)));
    
    stubFor(get(urlMatching("/1/courses/staffMemberRoles"))
        .willReturn(
          aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody("")
            .withStatus(204)));
    
    stubFor(get(urlMatching("/1/courses/courses/.*/students?filterArchived=false"))
        .willReturn(
          aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody("")
            .withStatus(204)));
    
    stubFor(get(urlMatching("/1/courses/courses/.*/staffMembers"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("")
          .withStatus(204)));
  }

//  @Test
//  public void IndexPageTest() throws IOException {
//    getWebDriver().get(getAppUrl());
//    boolean elementExists = getWebDriver().findElements(By.className("index")).size() > 0;
//    assertTrue(elementExists);
//  }
  
  @Test
  @SqlBefore("sql/loginSetup.sql")
  @SqlAfter("sql/loginTeardown.sql")
  public void loginTest() throws IOException {
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
//    takeScreenshot();
//    getWebDriver().get(getAppUrl());
//    getWebDriver().get("http://localhost:8089/1/persons/persons/2");
//    sleep(1000);
//    takeScreenshot();
//    getWebDriver().get("http://0.0.0.0:8089/1/students/students/1/emails");
//    sleep(1000);
//    takeScreenshot();
//    sleep(500);
  }
}
