package fi.otavanopisto.muikku.rest.test;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

import java.util.EnumSet;

import org.junit.Test;

import io.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.TestRole;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.pyramus.rest.model.Course;

public class SystemRESTPermissionsTestsIT extends AbstractRESTTest {

  private static final Long TEST_WORKSPACE_ID = 1L;

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
    EnumSet<TestRole> testRoles = EnumSet.allOf(TestRole.class);
    
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
  
  @Test
  public void testEnvironmentPermission() {
    EnumSet<TestRole> testRoles = EnumSet.allOf(TestRole.class);
    testRoles.remove(TestRole.EVERYONE);

    // Tests ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM
    
    roles(testRoles).forEach(role ->
      role.getRequest()
        .get(String.format("/test_permissions/environmentpermissions/%s", "FORUM_ACCESSENVIRONMENTFORUM"))
        .then()
        .statusCode(204)
    );
  }

  @Test
  public void testWorkspacePermission() {
    EnumSet<TestRole> testRoles = EnumSet.allOf(TestRole.class);
    testRoles.remove(TestRole.EVERYONE);

    // Tests ForumResourcePermissionCollection.FORUM_ACCESSENVIRONMENTFORUM
    
    roles(testRoles).forEach(role ->
      role.getRequest()
        .get(String.format("/test_permissions/workspaces/%d/permissions/%s", TEST_WORKSPACE_ID, "FORUM_ACCESSENVIRONMENTFORUM"))
        .then()
        .statusCode(204)
    );
  }

  @Test
  public void testWorkspacePermissionFromSameOrganization() throws Exception {
    Course course1 = new CourseBuilder()
        .id(2L)
        .organizationId(1L)
        .name("testcourse")
        .description("test course for testing")
        .buildCourse();

    Workspace workspace = tools().createWorkspace(course1, true);
    try {
      asManager()
        .get(String.format("/test_permissions/workspaces/%d/permissions/%s", workspace.getId(), MuikkuPermissions.MANAGE_WORKSPACE))
        .then()
        .statusCode(204);
    } finally {
      tools().deleteWorkspace(workspace);
    }
  }


  @Test
  public void testWorkspacePermissionFromAnotherOrganization() throws Exception {
    Course course1 = new CourseBuilder()
        .id(2L)
        .organizationId(2L)
        .name("testcourse")
        .description("test course for testing")
        .buildCourse();

    Workspace workspace = tools().createWorkspace(course1, true);
    try {
      asManager()
        .get(String.format("/test_permissions/workspaces/%d/permissions/%s", workspace.getId(), MuikkuPermissions.MANAGE_WORKSPACE))
        .then()
        .statusCode(403);
    } finally {
      tools().deleteWorkspace(workspace);
    }
  }
  
}
