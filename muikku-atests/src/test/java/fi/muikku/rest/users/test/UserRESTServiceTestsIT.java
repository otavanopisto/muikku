package fi.muikku.rest.users.test;

import static org.hamcrest.Matchers.is;

import java.util.List;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.QueryParam;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import com.jayway.restassured.response.Response;

import fi.muikku.AbstractRESTPermissionsTest;
import fi.muikku.AbstractRESTTest;

@RunWith(Parameterized.class)
public class UserRESTServiceTestsIT extends AbstractRESTTest {

  public UserRESTServiceTestsIT() {
  }
  
  @Before
  public void before() {
  }
  
  @After
  public void after() {
 }
  
  /**
   * /user/users
   * /user/users/{ID}
   * /user/users/{ID}/basicinfo
   */
  
  @Test
  public void testFindUser() throws NoSuchFieldException {
    Long userId = 1l;
    
    Response response = asAdmin().get("/user/users/{ID}", userId);
    
    // TODO: Content tests

    response.then().statusCode(200);
  }

  @Test
  public void testFindUserBasicInfo() throws NoSuchFieldException {
    Long userId = 1l;
    
    Response response = asAdmin()
        .get("/user/users/{ID}/basicinfo", userId);

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsers() throws NoSuchFieldException {
    Response response = asAdmin()
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsersWithUserGroups() throws NoSuchFieldException {
    Long userGroupId = 123l;
    
    Response response = asAdmin()
        .param("userGroupIds", userGroupId)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsersWithMyUserGroups() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myUserGroups", true)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }
  
  @Test
  public void testSearchUsersWithWorkspaces() throws NoSuchFieldException {
    Long workspaceId = 123l;
    
    Response response = asAdmin()
        .param("workspaceIds", workspaceId)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsersWithMyWorkspaces() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myWorkspaces", true)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsersWithSearchString() throws NoSuchFieldException {
    String searchString = "a";
    
    Response response = asAdmin()
        .param("searchString", searchString)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  @Test
  public void testSearchUsersWithArchetype() throws NoSuchFieldException {
    String archetype = "STUDENT";
    
    Response response = asAdmin()
        .param("archetype", archetype)
        .get("/user/users");

    // TODO: Content tests
    
    response.then().statusCode(200);
  }

  
}
