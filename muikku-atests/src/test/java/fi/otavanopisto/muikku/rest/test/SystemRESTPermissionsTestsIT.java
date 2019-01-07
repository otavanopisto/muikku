package fi.otavanopisto.muikku.rest.test;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;

import java.util.EnumSet;

import org.junit.Test;

import com.jayway.restassured.response.Response;

import fi.otavanopisto.muikku.TestRole;
import fi.otavanopisto.muikku.rest.test.plugins.announcer.AbstractAnnouncerRESTTestsIT;

public class SystemRESTPermissionsTestsIT extends AbstractAnnouncerRESTTestsIT {

  public SystemRESTPermissionsTestsIT() {
  }
  
  @Test
  public void testRestPermitLoggedInWithRoles() throws NoSuchFieldException {
    // Tests that the endpoint returns 204 as expected when there is a logged user
    roles(TestRole.ADMIN, TestRole.MANAGER, TestRole.TEACHER, TestRole.STUDENT).forEach(role ->
      role.getRequest()
        .get("/test_permissions/restpermit/loggedin")
        .then()
        .statusCode(204)
    );
  }
  
  @Test
  public void testRestPermitLoggedInWithEveryone() throws NoSuchFieldException {
    // Tests that 403 is returned when there is no user logged in
    asEveryone()
      .get("/test_permissions/restpermit/loggedin")
      .then()
      .statusCode(403);
  }

  @Test
  public void testRestPermitEveryoneEndpoint() throws NoSuchFieldException {
    // Tests that the endpoint returns 204 as expected when there is a logged user
    roles(TestRole.ADMIN, TestRole.MANAGER, TestRole.TEACHER, TestRole.STUDENT, TestRole.EVERYONE).forEach(role ->
      role.getRequest()
        .get("/test_permissions/restpermit/EVERYONE")
        .then()
        .statusCode(204)
    );
  }
  
  @Test
  public void testRestPermitRoles() throws NoSuchFieldException {
    // Tests that the endpoint returns 204 as expected when there is a logged user
    EnumSet<TestRole> testRoles = EnumSet.of(TestRole.ADMIN, TestRole.MANAGER, TestRole.TEACHER, TestRole.STUDENT, TestRole.EVERYONE);
    
    for (TestRole testRole : testRoles) {
      if (testRole == TestRole.EVERYONE) {
        // Skip EVERYONE endpoint as it's open for all and not applicable to the same restrictions
        continue;
      }
      
      roles(testRoles).forEach(role -> {
        String endpoint = String.format("/test_permissions/restpermit/%s", testRole.toString());
        Response response = role.getRequest().get(endpoint);
        
        int expectedStatusCode = testRole == role.getRole() ? 204 : 403;
        assertThat(
            String.format("Status code <%d> didn't match expected code <%d> when Role = %s, endpoint = %s",
                response.statusCode(), expectedStatusCode, role.getRole(), endpoint),
            response.statusCode(), is(expectedStatusCode));
      });
    }
  }
  
}
