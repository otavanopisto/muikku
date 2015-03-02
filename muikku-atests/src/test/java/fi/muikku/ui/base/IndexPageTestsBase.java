package fi.muikku.ui.base;

import static org.junit.Assert.assertTrue;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;

public class IndexPageTestsBase extends AbstractUITest {

  @Before
  public void requiredPyramusMocks() {
    
    stubFor(get(urlMatching("/dnm"))
      .willReturn(
        aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody("")
        .withStatus(204)));
    
    stubFor(get(urlMatching("/users/authorize.*"))
    // .withQueryParam("client_id", matching("*"))
    // .withQueryParam("response_type", matching("*"))
    // .withQueryParam("redirect_uri", matching("*"))
      // .withHeader("Accept", equalTo("text/json"))
      .willReturn(
        aResponse()
          .withStatus(302)
          .withHeader("Content-Length", "0")
          .withHeader("Location", "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));

    stubFor(post(urlMatching("/1/oauth/token")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody("{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
        .withStatus(200)));

    stubFor(get(urlMatching("/1/system/whoami")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody("{\"id\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"emails\":[\"testuser@made.up\"]}")
        .withStatus(200)));

    stubFor(get(urlMatching("/1/students/students/.*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("{\"id\":1,\"personId\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"nickname\":null,\"additionalInfo\":null,\"additionalContactInfo\":null,\"nationalityId\":null,\"languageId\":null,\"municipalityId\":null,\"schoolId\":null,\"activityTypeId\":null,\"examinationTypeId\":null,\"educationalLevelId\":null,\"studyTimeEnd\":null,\"studyProgrammeId\":1,\"previousStudies\":null,\"education\":null,\"lodging\":false,\"studyStartDate\":null,\"studyEndDate\":null,\"studyEndReasonId\":null,\"studyEndText\":null,\"variables\":{},\"tags\":[],\"archived\":false}")
          .withStatus(200)));

    stubFor(get(urlMatching("/1/students/students/.*/emails")).willReturn(
      aResponse().withHeader("Content-Type", "application/json")
        .withBody("{\"id\":1,\"contactTypeId\":2,\"defaultAddress\":true,\"address\":\"testuser@made.up\"}")
        .withStatus(200)));

    stubFor(get(urlEqualTo("/1/students/students?email=testuser@made.up"))
    // .withQueryParam("email", matching(".*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("[{\"id\":1,\"personId\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"nickname\":\"Student\",\"additionalInfo\":null,\"additionalContactInfo\":null,\"nationalityId\":null,\"languageId\":null,\"municipalityId\":1,\"schoolId\":null,\"activityTypeId\":null,\"examinationTypeId\":null,\"educationalLevelId\":null,\"studyTimeEnd\":null,\"studyProgrammeId\":1,\"previousStudies\":null,\"education\":null,\"lodging\":false,\"studyStartDate\":null,\"studyEndDate\":null,\"studyEndReasonId\":null,\"studyEndText\":null,\"variables\":{},\"tags\":[],\"archived\":false}]")
          .withStatus(200)));

    stubFor(get(urlMatching("/1/persons/persons/.*"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("{\"id\":1,\"birthday\":\"1990-02-04T00:00:00.000+02:00\",\"socialSecurityNumber\":\"345345-3453\",\"sex\":\"MALE\",\"secureInfo\":false,\"basicInfo\":null,\"defaultUserId\":1}")
          .withStatus(200)));

    stubFor(get(urlEqualTo("/1/students/students?filterArchived=false&firstResult=0&maxResults=100"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("[{\"id\":1,\"personId\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"nickname\":null,\"additionalInfo\":null,\"additionalContactInfo\":null,\"nationalityId\":null,\"languageId\":null,\"municipalityId\":null,\"schoolId\":null,\"activityTypeId\":null,\"examinationTypeId\":null,\"educationalLevelId\":null,\"studyTimeEnd\":null,\"studyProgrammeId\":1,\"previousStudies\":null,\"education\":null,\"lodging\":false,\"studyStartDate\":null,\"studyEndDate\":null,\"studyEndReasonId\":null,\"studyEndText\":null,\"variables\":{},\"tags\":[],\"archived\":false}]")
          .withStatus(200)));
    
    stubFor(get(urlMatching("/1/staff/members"))
      .withQueryParam("email", matching("staff@made.up"))
      .willReturn(
        aResponse()
          .withHeader("Content-Type", "application/json")
          .withBody("[{\"id\":5,\"personId\":5,\"additionalContactInfo\":null,\"firstName\":\"Test\",\"lastName\":\"Staffmember\",\"title\":null,\"role\":\"ADMINISTRATOR\",\"variables\":{},\"tags\":[]}]")
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
    getWebDriver().get(getAppUrl());
//    waitForElementToBeClickable(By.className("bt-login"));
//    getWebDriver().findElement(By.className("bt-login")).click();
    getWebDriver().get("http://dev.muikku.fi:8080/login?authSourceId=1");
    sleep(500);
////    waitForElementToBePresent(By.className("index"));
    takeScreenshot();
//    getWebDriver().get(getAppUrl());
//    getWebDriver().get("http://0.0.0.0:8089/1/students/students?email=testuser@made.up");
//    sleep(1000);
//    takeScreenshot();
//    getWebDriver().get("http://0.0.0.0:8089/1/students/students/1/emails");
//    sleep(1000);
//    takeScreenshot();
//    sleep(500);
  }
}
