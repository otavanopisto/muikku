package fi.otavanopisto.muikku.rest.test.plugins.forum;

import org.junit.Test;

import com.jayway.restassured.response.Response;

import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaGroupRESTModel;

public class ForumGroupPermissionsTestsIT extends AbstractForumRESTTestsIT {

  @Test
  public void testCreateAreaGroupAdmin() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    response.then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateAreaGroupManager() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
    
    Response response = asManager()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    response.then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateAreaGroupTeacher() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
    
    Response response = asTeacher()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    response.then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateAreaGroupStudent() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
    
    asStudent()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups")
      .then()
      .statusCode(403);
  }
  
  @Test
  public void testListAreaGroupsAdmin() throws NoSuchFieldException {
    asAdmin()
      .get("/forum/areagroups")
      .then()
      .statusCode(204);
  }

  @Test
  public void testListAreaGroupsStudent() throws NoSuchFieldException {
    asStudent()
      .get("/forum/areagroups")
      .then()
      .statusCode(204);
  }

  @Test
  public void testListAreaGroupsTeacher() throws NoSuchFieldException {
    asTeacher()
      .get("/forum/areagroups")
      .then()
      .statusCode(204);
  }

  @Test
  public void testListAreaGroupsManager() throws NoSuchFieldException {
    asManager()
      .get("/forum/areagroups")
      .then()
      .statusCode(204);
  }

  @Test
  public void testFindAreaGroupAdmin() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long areaGroupId = new Long(response.body().jsonPath().getInt("id"));
    
    asAdmin()
      .get("/forum/areagroups/{ID}", areaGroupId)
      .then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(areaGroupId);
  }

  @Test
  public void testFindAreaGroupManager() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long areaGroupId = new Long(response.body().jsonPath().getInt("id"));
    
    asManager()
      .get("/forum/areagroups/{ID}", areaGroupId)
      .then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(areaGroupId);
  }

  @Test
  public void testFindAreaGroupTeacher() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long areaGroupId = new Long(response.body().jsonPath().getInt("id"));
    
    asTeacher()
      .get("/forum/areagroups/{ID}", areaGroupId)
      .then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(areaGroupId);
  }

  @Test
  public void testFindAreaGroupStudent() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long areaGroupId = new Long(response.body().jsonPath().getInt("id"));
    
    asStudent()
      .get("/forum/areagroups/{ID}", areaGroupId)
      .then()
      .statusCode(200);
    
    permanentDeleteAreaGroup(areaGroupId);
  }

  @Test
  public void testDeleteAreaEnvironmentAdmin() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long id = new Long(response.body().jsonPath().getInt("id"));

    asAdmin()
      .delete("/forum/areagroups/{ID}", id)
      .then()
      .statusCode(204);
    
    permanentDeleteAreaGroup(id);
  }
  
  @Test
  public void testDeleteAreaEnvironmentStudent() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long id = new Long(response.body().jsonPath().getInt("id"));

    asStudent()
      .delete("/forum/areagroups/{ID}", id)
      .then()
      .statusCode(403);
    
    permanentDeleteAreaGroup(id);
  }
  
  @Test
  public void testDeleteAreaEnvironmentManager() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long id = new Long(response.body().jsonPath().getInt("id"));

    asManager()
      .delete("/forum/areagroups/{ID}", id)
      .then()
      .statusCode(403);
    
    permanentDeleteAreaGroup(id);
  }
  
  @Test
  public void testDeleteAreaEnvironmentTeacher() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    
    Long id = new Long(response.body().jsonPath().getInt("id"));

    asTeacher()
      .delete("/forum/areagroups/{ID}", id)
      .then()
      .statusCode(403);
    
    permanentDeleteAreaGroup(id);
  }
  
}
