package fi.muikku;

import static com.jayway.restassured.RestAssured.certificate;
import static com.jayway.restassured.RestAssured.given;

import org.junit.Before;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSenderOptions;
import com.jayway.restassured.specification.RequestSpecification;

public abstract class AbstractRESTTest extends AbstractIntegrationTest {
  
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
  
  protected RequestSpecification asAdmin() {
    RequestSpecification request = RestAssured.given();
    if (adminSessionId == null) {
      adminSessionId = loginAs(RoleType.ENVIRONMENT, "ADMINISTRATOR");
    }
    
    return request.cookie("JSESSIONID", adminSessionId);
  }
  
  protected RequestSenderOptions<Response> asManager() {
    RequestSpecification request = RestAssured.given();
    if (managerSessionId == null) {
      managerSessionId = loginAs(RoleType.ENVIRONMENT, "MANAGER");
    }
    
    return request.cookie("JSESSIONID", managerSessionId);
  }

  protected RequestSenderOptions<Response> asTeacher() {
    RequestSpecification request = RestAssured.given();
    if (teacherSessionId == null) {
      teacherSessionId = loginAs(RoleType.ENVIRONMENT, "TEACHER");
    }
    
    return request.cookie("JSESSIONID", teacherSessionId);
  }

  protected RequestSpecification asStudent() {
    RequestSpecification request = RestAssured.given();
    if (studentSessionId == null) {
      studentSessionId = loginAs(RoleType.ENVIRONMENT, "STUDENT");
    }
    
    return request.cookie("JSESSIONID", studentSessionId);
  }
  
  private static String loginAs(RoleType type, String role) {
    Response response = given()
      .contentType("application/json")
      .get("/test/login?role=" + getFullRoleName(type, role));
    return response.getCookie("JSESSIONID");
  }

  private static String getFullRoleName(RoleType roleType, String role) {
    return roleType.name() + "-" + role;
  }
  
  enum RoleType {
    PSEUDO,
    ENVIRONMENT,
    WORKSPACE
  }

  private String adminSessionId;
  private String managerSessionId;
  private String teacherSessionId;
  private String studentSessionId;
}
