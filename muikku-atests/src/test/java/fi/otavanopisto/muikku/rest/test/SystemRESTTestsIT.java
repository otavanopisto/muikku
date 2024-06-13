package fi.otavanopisto.muikku.rest.test;

import static org.hamcrest.Matchers.is;

import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import io.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class SystemRESTTestsIT extends AbstractRESTTest {

  private static final boolean STRICT_JSON = false; 

  public SystemRESTTestsIT() {
  }
  
  @Test
  public void testPingPong() {
    Response response = asAdmin()
      .get("/system/ping");
    
    response.then()
      .statusCode(200)
      .body(is("pong"));
  }

  /**
   * Tests that SchoolDataIdentifier as a PathParam is parsed correctly.
   * The SchoolDataIdentifier is returned as an object with the fields 
   * separated so they can be validated.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_path() {
    SchoolDataIdentifier sdi = new SchoolDataIdentifier("TESTIDENTIFIER", "TESTDATASOURCE");
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter/%s", sdi.toId()));
    
    response.then().statusCode(200);
    String expected = "{\"identifier\":\"TESTIDENTIFIER\",\"datasource\":\"TESTDATASOURCE\"}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with a string that isn't 
   * parseable as SchoolDataIdentifier. The expected result is 400 Bad Request.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_path_fail() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter/%s", "ASDASDASD"));
    
    response.then().statusCode(400);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with an empty string. 
   * The expected result is 404 Not found as the platform can't find 
   * the endpoint.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_path_notfound() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter/%s", ""));
    
    response.then().statusCode(404);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with an empty string. 
   * The expected result is 404 Not found as the platform can't find 
   * the endpoint.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_path_notfound2() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter/%s", "     "));
    
    response.then().statusCode(404);
  }

  /**
   * Tests that SchoolDataIdentifier as a QueryParam is parsed correctly.
   * The SchoolDataIdentifier is returned as an object with the fields 
   * separated so they can be validated.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_query() {
    SchoolDataIdentifier sdi = new SchoolDataIdentifier("TESTIDENTIFIER", "TESTDATASOURCE");
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter_queryparam?SDI=%s", sdi.toId()));
    
    response.then().statusCode(200);
    String expected = "{\"identifier\":\"TESTIDENTIFIER\",\"datasource\":\"TESTDATASOURCE\"}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with a string that isn't 
   * parseable as SchoolDataIdentifier. The expected result is 400 Bad Request.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_query_fail() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter_queryparam?SDI=%s", "ASDASDASD"));
    
    response.then().statusCode(400);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter without queryparam. 
   * The expected result is 204 for null queryparam.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_query_notfound() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter_queryparam"));
    
    response.then().statusCode(204);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with an empty string. 
   * The expected result is 204 for null queryparam.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_query_notfound2() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter_queryparam?SDI=%s", ""));
    
    response.then().statusCode(204);
  }

  /**
   * Tests SchoolDataIdentifier ParamConverter with an empty string. 
   * The expected result is 204 for null queryparam.
   */
  @Test
  public void testSchoolDataIdentifier_ParamConverter_query_notfound3() {
    Response response = asAdmin()
      .get(String.format("/test/sdi_paramconverter_queryparam?SDI=%s", "    "));
    
    response.then().statusCode(204);
  }

}
