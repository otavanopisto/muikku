package fi.otavanopisto.muikku;

import static com.jayway.restassured.RestAssured.certificate;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.ArrayUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Rule;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;
import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;

import fi.otavanopisto.muikku.rest.test.PyramusMocksRest;
import fi.otavanopisto.muikku.rest.test.RestTestRequest;

public abstract class AbstractRESTTest extends AbstractIntegrationTest {
  
  @Rule
  public WireMockRule wireMockRule = new WireMockRule(Integer.parseInt(System.getProperty("it.wiremock.port")));

  @Before
  public void setupMocks() throws Exception {
    List<String> payloads = new ArrayList<String>();

    PyramusMocksRest.mockDefaults(payloads);
    
    for (String s : payloads) {
      webhookCall("http://dev.muikku.fi:" + getPortHttp() + "/pyramus/webhook", s);
    }
  }
  
  @Before
  public void setupRestAssured() throws JsonProcessingException {
    RestAssured.baseURI = getAppUrl(true) + "/rest";
    RestAssured.port = getPortHttps();
    RestAssured.authentication = certificate(getKeystoreFile(), getKeystorePass());
    RestAssured.config = RestAssuredConfig.config().objectMapperConfig(
        ObjectMapperConfig.objectMapperConfig().jackson2ObjectMapperFactory(new Jackson2ObjectMapperFactory() {

          @SuppressWarnings("rawtypes")
          @Override
          public com.fasterxml.jackson.databind.ObjectMapper create(Class cls, String charset) {
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            objectMapper.registerModule(new JSR310Module());
            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
            return objectMapper;
          }
        }));
  }
  
  @After
  public void resetMocks() throws Exception {
    PyramusMocksRest.resetWireMock();
  }
  
  protected Set<RestTestRequest> roles(EnumSet<TestRole> set) {
    return roles(set.toArray(new TestRole[0]));
  }
  
  protected Set<RestTestRequest> roles(TestRole ... roles) {
    Set<RestTestRequest> set = new HashSet<>();
    
    if (ArrayUtils.contains(roles, TestRole.ADMIN))
      set.add(new RestTestRequest(asAdmin(), TestRole.ADMIN));
    if (ArrayUtils.contains(roles, TestRole.MANAGER))
      set.add(new RestTestRequest(asManager(), TestRole.MANAGER));
    if (ArrayUtils.contains(roles, TestRole.TEACHER))
      set.add(new RestTestRequest(asTeacher(), TestRole.TEACHER));
    if (ArrayUtils.contains(roles, TestRole.STUDENT))
      set.add(new RestTestRequest(asStudent(), TestRole.STUDENT));
    if (ArrayUtils.contains(roles, TestRole.EVERYONE))
      set.add(new RestTestRequest(asEveryone(), TestRole.EVERYONE));
    
    return set;
  }
}