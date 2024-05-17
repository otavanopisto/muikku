package fi.otavanopisto.muikku.rest.users.test;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

import fi.otavanopisto.muikku.AbstractRESTTest;
import io.restassured.response.Response;

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
   * /user/users/{ID}
   */
  
  @Test
  public void testFindStudent1AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-1";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-1\",\"firstName\":\"Test\",\"lastName\":\"User\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"te...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2070-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":1,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent6AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-6";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-6\",\"firstName\":\"Hidden\",\"lastName\":\"Dragon\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"cr...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":6,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }
  
  @Test
  public void testFindStudent7AsAdmin() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-7";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-7\",\"firstName\":\"Constipated\",\"lastName\":\"Moose\",\"nickName\":null,\"studyProgrammeName\":\"Secondary Organization Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"co...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":7,\"organization\":{\"id\":2,\"name\":\"Secondary Test Organization\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }
  
  @Test
  public void testFindStudent1AsStudent() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-1";
    
    Response response = asStudent().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-1\",\"firstName\":\"Test\",\"lastName\":\"User\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"te...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2070-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":1,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
    JSONAssert.assertEquals(expected, response.body().asString(), STRICT_JSON);
  }

  @Test
  public void testFindStudent6AsTeacher() throws NoSuchFieldException {
    String studentId = "PYRAMUS-STUDENT-6";
    
    Response response = asAdmin().get("/user/students/{ID}", studentId);
    
    response.then().statusCode(200);
    String expected = "{\"id\":\"PYRAMUS-STUDENT-6\",\"firstName\":\"Hidden\",\"lastName\":\"Dragon\",\"nickName\":null,\"studyProgrammeName\":\"Test Study Programme\",\"hasImage\":false,\"nationality\":null,\"language\":null,\"municipality\":null,\"school\":null,\"email\":\"cr...@example.com\",\"studyStartDate\":\"2010-01-01T00:00:00.000+00:00\",\"studyEndDate\":\"2011-01-01T00:00:00.000+00:00\",\"studyTimeEnd\":null,\"curriculumIdentifier\":null,\"updatedByStudent\":false,\"userEntityId\":6,\"organization\":{\"id\":1,\"name\":\"Default\"}}";
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
