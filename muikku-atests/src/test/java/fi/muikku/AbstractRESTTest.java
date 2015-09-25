package fi.muikku;

import static com.jayway.restassured.RestAssured.certificate;

import org.junit.Before;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.jayway.restassured.RestAssured;
import com.jayway.restassured.config.ObjectMapperConfig;
import com.jayway.restassured.config.RestAssuredConfig;
import com.jayway.restassured.mapper.factory.Jackson2ObjectMapperFactory;

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
}
