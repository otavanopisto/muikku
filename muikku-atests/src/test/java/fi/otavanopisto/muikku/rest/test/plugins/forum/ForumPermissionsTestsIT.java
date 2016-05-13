package fi.otavanopisto.muikku.rest.test.plugins.forum;

import org.junit.Test;

import com.jayway.restassured.response.Response;

import static org.hamcrest.core.Is.is;
import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaRESTModel;

public class ForumPermissionsTestsIT extends AbstractRESTTest {
  
  @Test
  public void testCreateEnvironmentForumAdmin() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    response.then()
      .statusCode(200);

    asAdmin().delete("/forum/areas/{ID}?permanent=true", new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateEnvironmentForumManager() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asManager()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    response.then()
      .statusCode(200);

    asAdmin().delete("/forum/areas/{ID}?permanent=true", new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateEnvironmentForumTeacher() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asTeacher()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    response.then()
      .statusCode(200);

    asAdmin().delete("/forum/areas/{ID}?permanent=true", new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateEnvironmentForumStudent() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    asStudent()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas")
      .then()
      .statusCode(403);
  }
  
  @Test
  public void testListAreasAdmin() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asAdmin()
        .get("/forum/areas")
        .then()
        .statusCode(200)
        .body("id.size()", is(1));      
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
  @Test
  public void testListAreasManager() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asManager()
        .get("/forum/areas")
        .then()
        .statusCode(200)
        .body("id.size()", is(1));
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
  @Test
  public void testListAreasTeacher() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asTeacher()
        .get("/forum/areas")
        .then()
        .statusCode(200)
        .body("id.size()", is(1));
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
  @Test
  public void testListAreasStudent() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asStudent()
        .get("/forum/areas")
        .then()
        .statusCode(200)
        .body("id.size()", is(1));
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    } 
  }
  
  @Test
  public void testFindAreaAdmin() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asAdmin()
        .get("/forum/areas/{ID}", areaId)
        .then()
        .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  } 
  
  @Test
  public void testFindAreaManager() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asManager()
        .get("/forum/areas/{ID}", areaId)
        .then()
        .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
  @Test
  public void testFindAreaTeacher() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asTeacher()
        .get("/forum/areas/{ID}", areaId)
        .then()
        .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
  @Test
  public void testFindAreaStudent() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");
    
    Long areaId = new Long(response.body().jsonPath().getInt("id"));
    try{
      asStudent()
        .get("/forum/areas/{ID}", areaId)
        .then()
        .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);      
    }
  }
  
////  testUpdate
////  testDelete
//  
////  @Test
////  public void testUpdateContactURLType() throws NoSuchFieldException {
////    ContactURLType contactURLType = new ContactURLType(null, "Not Updated", Boolean.FALSE);
////    
////    Response response = given().headers(getAdminAuthHeaders())
////      .contentType("application/json")
////      .body(contactURLType)
////      .post("/common/contactURLTypes");
////    
////    Long id = new Long(response.body().jsonPath().getInt("id"));
////    try {
////      ContactURLType updateContactURLType = new ContactURLType(id, "Updated", Boolean.FALSE);
////
////      Response updateResponse = given().headers(getAuthHeaders())
////        .contentType("application/json")
////        .body(updateContactURLType)
////        .put("/common/contactURLTypes/{ID}", id);
////      assertOk(updateResponse, forumPermissions, CommonPermissions.UPDATE_CONTACTURLTYPE, 200);
////
////    } finally {
////      given().headers(getAdminAuthHeaders())
////        .delete("/common/contactURLTypes/{ID}?permanent=true", id);
////    }
////  }

  @Test
  public void testDeleteForumAreaAdmin() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    Long id = new Long(response.body().jsonPath().getInt("id"));
    try{
      Response deleteResponse = asAdmin()
        .delete("/forum/areas/{ID}", id);
      
      deleteResponse
        .then()
        .statusCode(204);
        
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", id);  
    }
  }

  @Test
  public void testDeleteForumAreaManager() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    Long id = new Long(response.body().jsonPath().getInt("id"));
    try{
      asManager()
        .delete("/forum/areas/{ID}", id)
        .then()
        .statusCode(403);  
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", id);      
    }
  }  

  @Test
  public void testDeleteForumAreaTeacher() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    Long id = new Long(response.body().jsonPath().getInt("id"));
    try{
      asTeacher()
        .delete("/forum/areas/{ID}", id)
        .then()
        .statusCode(403);      
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", id);
    }
  }  

  @Test
  public void testDeleteForumAreaStudent() throws NoSuchFieldException {
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    Long id = new Long(response.body().jsonPath().getInt("id"));
    try{
      asStudent()
        .delete("/forum/areas/{ID}", id)
        .then()
        .statusCode(403);      
    }finally{
      asAdmin().delete("/forum/areas/{ID}?permanent=true", id);
    }
  }  
}
