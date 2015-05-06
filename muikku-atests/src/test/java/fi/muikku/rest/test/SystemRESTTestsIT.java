package fi.muikku.rest.test;

import static org.hamcrest.Matchers.is;

import org.junit.Test;

import com.jayway.restassured.response.Response;

import fi.muikku.AbstractRESTPermissionsTest;

public class SystemRESTTestsIT extends AbstractRESTPermissionsTest {

  public SystemRESTTestsIT() {
  }
  
  @Test
  public void testListAreaGroups() throws NoSuchFieldException {
    Response response = asAdmin()
      .get("/system/ping");
    
    response.then()
      .statusCode(200)
      .content(is("pong"));
  }

}
