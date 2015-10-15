package fi.muikku.rest.users.test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import com.jayway.restassured.response.Response;

import fi.muikku.AbstractRESTTest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.model.users.EnvironmentRoleArchetype;

public class UserRESTServiceTestsIT extends AbstractRESTTest {

  public UserRESTServiceTestsIT() {
  }
  
  @Before
  public void before() throws Exception {
    asAdmin().get("/test/reindex");
  }
  
  @After
  public void after() throws Exception {
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
    
    response.then().statusCode(200);
    
    String expected = "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
  public void testFindUserBasicInfo() throws NoSuchFieldException {
    Long userId = 1l;
    
    Response response = asAdmin()
        .get("/user/users/{ID}/basicinfo", userId);

    response.then().statusCode(200);

    String expected = "{'id':1,'firstName':'Test','lastName':'User','hasImage':false}";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
  public void testSearchUsers() throws NoSuchFieldException {
    Response response = asAdmin()
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':2,'firstName':'Test','lastName':'Staff1member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':3,'firstName':'Test','lastName':'Staff2member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ma...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':5,'firstName':'Trusted','lastName':'System','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'tr...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
//  @SqlBefore("sql/userSearchUserGroupSetup.sql")
//  @SqlAfter("sql/userSearchUserGroupDelete.sql")
  public void testSearchUsersWithUserGroups() throws NoSuchFieldException {
    Long userGroupId = 1l;
    
    Response response = asAdmin()
        .param("userGroupIds", userGroupId)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
//  @SqlBefore("sql/userSearchUserGroupSetup.sql")
//  @SqlAfter("sql/userSearchUserGroupDelete.sql")
  public void testSearchUsersWithMyUserGroups() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myUserGroups", true)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }
  
  @Test
//  @SqlBefore("sql/userSearchWorkspaceSetup.sql")
//  @SqlAfter("sql/userSearchWorkspaceDelete.sql")
  public void testSearchUsersWithWorkspaces() throws NoSuchFieldException {
    Long workspaceId = 1l;
    
    Response response = asAdmin()
        .param("workspaceIds", workspaceId)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
//  @SqlBefore("sql/userSearchWorkspaceSetup.sql")
//  @SqlAfter("sql/userSearchWorkspaceDelete.sql")
  public void testSearchUsersWithMyWorkspaces() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myWorkspaces", true)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
  public void testSearchUsersWithSearchString() throws NoSuchFieldException {
    String searchString = "a";
    
    Response response = asAdmin()
        .param("searchString", searchString)
        .get("/user/users");

    response.then().statusCode(200);
    
    String expected = "[{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

  @Test
  public void testSearchUsersWithArchetype() throws NoSuchFieldException {
    String archetype = EnvironmentRoleArchetype.STUDENT.name();
    
    Response response = asAdmin()
        .param("archetype", archetype)
        .get("/user/users");

   response.then().statusCode(200);

    String expected = "[{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@made.up','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), true);
  }

}
