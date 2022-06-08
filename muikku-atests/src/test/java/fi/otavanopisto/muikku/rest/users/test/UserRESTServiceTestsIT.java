package fi.otavanopisto.muikku.rest.users.test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import io.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;

public class UserRESTServiceTestsIT extends AbstractRESTTest {

  public UserRESTServiceTestsIT() {
  }

  private static final boolean STRICT_JSON = false; 
  
  @Before
  public void before() throws Exception {
    asAdmin().get("/test/workspaces/1/publish");
    asAdmin().get("/test/reindex");
  }
  
  @After
  public void after() throws Exception {
  }
  
  /**
   * /user/users
   * /user/users/{ID}
   */
  
  @Test
  public void testFindUser() throws NoSuchFieldException {
    Long userId = 1l;
    
    Response response = asAdmin().get("/user/users/{ID}", userId);
    
    response.then().statusCode(200);
    
    String expected = "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsers() throws NoSuchFieldException {
    Response response = asAdmin()
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':2,'firstName':'Test','lastName':'Staff1member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':3,'firstName':'Test','lastName':'Staff2member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ma...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersAsStudent() throws NoSuchFieldException {
    Response response = asStudent()
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':2,'firstName':'Test','lastName':'Staff1member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':3,'firstName':'Test','lastName':'Staff2member','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ma...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersWithUserGroups() throws NoSuchFieldException {
    Long userGroupId = 2l;
    
    Response response = asAdmin()
        .param("userGroupIds", userGroupId)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersWithMyUserGroups() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myUserGroups", true)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }
  
  @Test
  public void testSearchUsersWithWorkspaces() throws NoSuchFieldException {
    Long workspaceId = 1l;
    
    Response response = asAdmin()
        .param("workspaceIds", workspaceId)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersWithMyWorkspaces() throws NoSuchFieldException {
    Response response = asAdmin()
        .param("myWorkspaces", true)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "["
        + "{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null},"
        + "{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersWithSearchString() throws NoSuchFieldException {
    String searchString = "a";
    
    Response response = asAdmin()
        .param("q", searchString)
        .get("/user/users");

    response.then().statusCode(200);
    
    String expected = "[{'id':4,'firstName':'Test','lastName':'Administrator','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'ad...@example.com','studyStartDate':null,'studyTimeEnd':null}]";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testSearchUsersWithArchetype() throws NoSuchFieldException {
    String archetype = EnvironmentRoleArchetype.STUDENT.name();
    
    Response response = asAdmin()
        .param("archetype", archetype)
        .get("/user/users");

    response.then().statusCode(200);

    String expected = "[{'id':1,'firstName':'Test','lastName':'User','hasImage':false,'nationality':null,'language':null,'municipality':null,'school':null,'email':'te...@example.com'}]";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent1AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-1";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-1\",\"firstName\":\"Test\",\"lastName\":\"User\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"te...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2070-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":1,\"flags\":null,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent6AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-6";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-6\",\"firstName\":\"Hidden\",\"lastName\":\"Dragon\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"cr...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":6,\"flags\":null,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }
  
  @Test
  public void testFindStudent7AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-7";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-7\",\"firstName\":\"Constipated\",\"lastName\":\"Moose\",\"nickName\":null,\"studyProgrammeName\":\"Secondary Organization Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"co...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":7,\"flags\":null,\"organization\":{\"id\":2,\"name\":\"Secondary Test Organization\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }
  
  @Test
  public void testFindStudent1AsStudent() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-1";
    
    Response response = asStudent().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-1\",\"firstName\":\"Test\",\"lastName\":\"User\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"te...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2070-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":1,\"flags\":null,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent6AsTeacher() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-6";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-6\",\"firstName\":\"Hidden\",\"lastName\":\"Dragon\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"cr...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":6,\"flags\":null,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent7AsTeacher() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-7";
    asTeacher().get("/user/students/{ID}", studentId).then().statusCode(403);
  }

  @Test
  public void testFindStudent6AsStudent() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-6";
    asStudent().get("/user/students/{ID}", studentId).then().statusCode(403);
  }

  @Test
  public void testFindStudent7AsStudent() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-7";
    asStudent().get("/user/students/{ID}", studentId).then().statusCode(403);
  }

}
