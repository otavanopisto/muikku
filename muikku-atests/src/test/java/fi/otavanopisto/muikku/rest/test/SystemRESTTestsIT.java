package fi.otavanopisto.muikku.rest.test;

import static org.hamcrest.Matchers.is;

import org.junit.Test;

import io.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;

public class SystemRESTTestsIT extends AbstractRESTTest {

  public SystemRESTTestsIT() {
  }
  
  @Test
  public void testListAreaGroups() throws NoSuchFieldException {
    Response response = asAdmin()
      .get("/system/ping");
    
    response.then()
      .statusCode(200)
      .body(is("pong"));
  }

}
