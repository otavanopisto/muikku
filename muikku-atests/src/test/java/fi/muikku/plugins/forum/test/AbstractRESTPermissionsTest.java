package fi.muikku.plugins.forum.test;

import static com.jayway.restassured.RestAssured.certificate;
import static com.jayway.restassured.RestAssured.given;
import static com.github.tomakehurst.wiremock.client.WireMock.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.oltu.oauth2.client.request.OAuthBearerClientRequest;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.junit.Before;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;
import com.jayway.restassured.response.Response;

import fi.muikku.AbstractIntegrationTest;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.security.MuikkuPermissionCollection;
import fi.pyramus.rest.model.Email;
import fi.pyramus.rest.model.Student;
import fi.pyramus.rest.model.WhoAmI;

public abstract class AbstractRESTPermissionsTest extends AbstractIntegrationTest {

  @Before
  public void requiredPyramusMocks() throws JsonProcessingException {
    stubFor(get(urlMatching("/dnm")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));
    stubFor(get(urlMatching("/users/authorize.*"))
    // .withQueryParam("client_id", matching("*"))
    // .withQueryParam("response_type", matching("*"))
    // .withQueryParam("redirect_uri", matching("*"))
    // .withHeader("Accept", equalTo("text/json"))
        .willReturn(
            aResponse()
                .withStatus(302)
                .withHeader("Content-Length", "0")
                .withHeader(
                    "Location",
                    "http://dev.muikku.fi:8080/login?_stg=rsp&code=1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111")));
    stubFor(post(urlMatching("/1/oauth/token"))
        .willReturn(
            aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(
                    "{\"expires_in\":3600,\"refresh_token\":\"12312ewsdf34fsd234r43rfsw32rf33e\",\"access_token\":\"ur84ur839843ruwf39843ru39ru37y2e\"}")
                .withStatus(200)));
    List<String> emails = new ArrayList<String>();
    emails.add("testuser@made.up");
    WhoAmI whoAmI = new WhoAmI((long) 1, "Test", "User", emails);
    ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    String whoAmIJson = ow.writeValueAsString(whoAmI);
    stubFor(get(urlMatching("/1/system/whoami")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody(whoAmIJson).withStatus(200)));
    Map<String, String> variables = null;
    List<String> tags = null;
    
    Student student = new Student((long) 1, (long) 1, "Test", "User", null, null, null, null, null, null, null, null,
        null, null, null, (long) 1, null, null, false, null, null, null, null, variables, tags, false);
    String studentJson = ow.writeValueAsString(student);
    stubFor(get(urlMatching("/1/students/students/.*")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody(studentJson).withStatus(200)));
    Email email = new Email((long) 1, (long) 2, true, "testuser@made.up");
    String emailJson = ow.writeValueAsString(email);
    stubFor(get(urlMatching("/1/students/students/.*/emails")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody(emailJson).withStatus(200)));
    Student[] studentArray = { student };
    String studentArrayJson = ow.writeValueAsString(studentArray);
    stubFor(get(urlEqualTo("/1/students/students?email=testuser@made.up"))
    // .withQueryParam("email", matching(".*"))
        .willReturn(
            aResponse().withHeader("Content-Type", "application/json").withBody(studentArrayJson).withStatus(200)));
    stubFor(get(urlMatching("/1/persons/persons/.*"))
        .willReturn(
            aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(
                    "{\"id\":1,\"birthday\":\"1990-02-04T00:00:00.000+02:00\",\"socialSecurityNumber\":\"345345-3453\",\"sex\":\"MALE\",\"secureInfo\":false,\"basicInfo\":null,\"defaultUserId\":1}")
                .withStatus(200)));
    stubFor(get(urlEqualTo("/1/students/students?filterArchived=false&firstResult=0&maxResults=100"))
        .willReturn(
            aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(
                    "[{\"id\":1,\"personId\":1,\"firstName\":\"Test\",\"lastName\":\"User\",\"nickname\":null,\"additionalInfo\":null,\"additionalContactInfo\":null,\"nationalityId\":null,\"languageId\":null,\"municipalityId\":null,\"schoolId\":null,\"activityTypeId\":null,\"examinationTypeId\":null,\"educationalLevelId\":null,\"studyTimeEnd\":null,\"studyProgrammeId\":1,\"previousStudies\":null,\"education\":null,\"lodging\":false,\"studyStartDate\":null,\"studyEndDate\":null,\"studyEndReasonId\":null,\"studyEndText\":null,\"variables\":{},\"tags\":[],\"archived\":false}]")
                .withStatus(200)));
    stubFor(get(urlMatching("/1/staff/members"))
        .withQueryParam("email", matching("staff@made.up"))
        .willReturn(
            aResponse()
                .withHeader("Content-Type", "application/json")
                .withBody(
                    "[{\"id\":5,\"personId\":5,\"additionalContactInfo\":null,\"firstName\":\"Test\",\"lastName\":\"Staffmember\",\"title\":null,\"role\":\"ADMINISTRATOR\",\"variables\":{},\"tags\":[]}]")
                .withStatus(200)));
    stubFor(get(urlMatching("/1/courses/staffMemberRoles")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));
    stubFor(get(urlMatching("/1/courses/courses/.*/students?filterArchived=false")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));
    stubFor(get(urlMatching("/1/courses/courses/.*/staffMembers")).willReturn(
        aResponse().withHeader("Content-Type", "application/json").withBody("").withStatus(204)));
    
    
    setAccessToken("ur84ur839843ruwf39843ru39ru37y2e");
  }  
  
  @Before
  public void setupRestAssured() {

    RestAssured.baseURI = getAppUrl(true) + "/1";
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
  public void createAccessTokens() {
    OAuthClientRequest tokenRequest = null;

//    if (!Role.EVERYONE.name().equals(role)) {
//      try {
//        tokenRequest = OAuthClientRequest.tokenLocation("https://dev.pyramus.fi:8443/1/oauth/token")
//            .setGrantType(GrantType.AUTHORIZATION_CODE).setClientId(Common.CLIENT_ID)
//            .setClientSecret(Common.CLIENT_SECRET).setRedirectURI(Common.REDIRECT_URL)
//            .setCode(Common.ROLEAUTHS.get(role)).buildBodyMessage();
//      } catch (OAuthSystemException e) {
//        e.printStackTrace();
//      }
//      
//      Response response = given().contentType("application/x-www-form-urlencoded").body(tokenRequest.getBody())
//          .post("/oauth/token");
//      String accessToken = response.body().jsonPath().getString("access_token");
//      setAccessToken(accessToken);
//    } else {
//      setAccessToken("");
//    }
//
//    /**
//     * AdminAccessToken
//     */
//    if (!Role.ADMINISTRATOR.name().equals(role)) {
//      tokenRequest = null;
//      try {
//        tokenRequest = OAuthClientRequest.tokenLocation("https://dev.pyramus.fi:8443/1/oauth/token")
//            .setGrantType(GrantType.AUTHORIZATION_CODE).setClientId(Common.CLIENT_ID)
//            .setClientSecret(Common.CLIENT_SECRET).setRedirectURI(Common.REDIRECT_URL)
//            .setCode(Common.ROLEAUTHS.get("ADMINISTRATOR")).buildBodyMessage();
//      } catch (OAuthSystemException e) {
//        e.printStackTrace();
//      }
//      Response response = given().contentType("application/x-www-form-urlencoded").body(tokenRequest.getBody())
//          .post("/oauth/token");
//  
//      String adminAccessToken = response.body().jsonPath().getString("access_token");
//      setAdminAccessToken(adminAccessToken);
//    } else {
//      setAdminAccessToken(accessToken);
//    }
  }
  
  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }
  
  public String getAdminAccessToken() {
    return adminAccessToken;
  }

  public void setAdminAccessToken(String adminAccesToken) {
    this.adminAccessToken = adminAccesToken;
  }

  public Map<String, String> getAuthHeaders() {
    OAuthClientRequest bearerClientRequest = null;
    try {
      bearerClientRequest = new OAuthBearerClientRequest("https://dev.muikku.fi")
          .setAccessToken(this.getAccessToken()).buildHeaderMessage();
    } catch (OAuthSystemException e) {
    }

    return bearerClientRequest.getHeaders();
  }
  
  public Map<String, String> getAdminAuthHeaders() {
    OAuthClientRequest bearerClientRequest = null;
    try {
      bearerClientRequest = new OAuthBearerClientRequest("https://dev.muikku.fi")
          .setAccessToken(this.getAdminAccessToken()).buildHeaderMessage();
    } catch (OAuthSystemException e) {
    }
    return bearerClientRequest.getHeaders();
  }

  public Long getUserIdForRole(String role) {
    // TODO: could this use the /system/whoami end-point?
    return Common.ROLEUSERS.get(role);
  }
  
  public boolean roleIsAllowed(String role, List<EnvironmentRoleArchetype> allowedRoles) {
    // Everyone -> every role has access
//    if (allowedRoles.contains(Role.EVERYONE.name()))
//      return true;
    
    EnvironmentRoleArchetype environmentRoleArchetype = EnvironmentRoleArchetype.valueOf(role);
    
    for (fi.muikku.model.users.EnvironmentRoleArchetype str : allowedRoles) {
      if (str.equals(environmentRoleArchetype)) {
        return true;
      }
    }
    return false;
  }

//  public void assertOk(String path, List<String> allowedRoles) {
//    if (!Role.EVERYONE.name().equals(getRole())) {
//      if (roleIsAllowed(getRole(), allowedRoles)) {
//        given().headers(getAuthHeaders()).get(path).then().assertThat().statusCode(200);
//      } else {
//        given().headers(getAuthHeaders()).get(path).then().assertThat().statusCode(403);
//      }
//    }
//    else
//      given().headers(getAuthHeaders()).get(path).then().assertThat().statusCode(400);
//  }

  public void assertOk(Response response, MuikkuPermissionCollection permissionCollection, String permission) throws NoSuchFieldException {
    assertOk(response, permissionCollection, permission, 200);
  }
  
  public void assertOk(Response response, MuikkuPermissionCollection permissionCollection, String permission, int successStatusCode) throws NoSuchFieldException {
//    if (!Role.EVERYONE.name().equals(getRole())) {
      List<fi.muikku.model.users.EnvironmentRoleArchetype> allowedRoles = Arrays.asList(permissionCollection.getDefaultEnvironmentRoles(permission));
      
      if (roleIsAllowed(getRole(), allowedRoles)) {
        response.then().assertThat().statusCode(successStatusCode);
      } else {
        response.then().assertThat().statusCode(403);
      }
//    }
//    else
//      response.then().assertThat().statusCode(400);
  }
  
  public static List<Object[]> getGeneratedRoleData() {
    // The parameter generator returns a List of
    // arrays. Each array has two elements: { role }.
    
    List<Object[]> data = new ArrayList<Object[]>();
    
    for (EnvironmentRoleArchetype role : EnvironmentRoleArchetype.values()) {
      data.add(new Object[] { 
        role.name() 
      });
    }
    
    return data;
  }
  
  protected String getRole() {
    return role;
  }

  protected void setRole(String role) {
    this.role = role;
  }

  protected String role;
  private String accessToken;
  private String adminAccessToken;
}
