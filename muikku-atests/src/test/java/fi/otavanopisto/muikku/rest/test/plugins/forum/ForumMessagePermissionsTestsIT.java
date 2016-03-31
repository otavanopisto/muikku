package fi.otavanopisto.muikku.rest.test.plugins.forum;

import java.util.Date;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.jayway.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadReplyRESTModel;

public class ForumMessagePermissionsTestsIT extends AbstractRESTTest {

  private Long forumAreaId = null;
  private Long threadId = null;
  private Long replyId = null;

  @Before
  public void before() {
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
  }
  
  @After
  public void after() {
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
    asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
  }
  
  @Test
  public void testCreateThreadAdmin() throws NoSuchFieldException {
    ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
        1l, new Date(), forumAreaId, false, false, new Date(), 1l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    response.then()
      .statusCode(200);
    
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateThreadManager() throws NoSuchFieldException {
    ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
        1l, new Date(), forumAreaId, false, false, new Date(), 1l);
    
    Response response = asManager()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    response.then()
      .statusCode(200);
    
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateThreadTeacher() throws NoSuchFieldException {
    ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
        1l, new Date(), forumAreaId, false, false, new Date(), 1l);
    
    Response response = asTeacher()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    response.then()
      .statusCode(200);
    
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateThreadStudent() throws NoSuchFieldException {
    ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
        1l, new Date(), forumAreaId, false, false, new Date(), 1l);
    
    Response response = asStudent()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    response.then()
      .statusCode(200);
    
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testCreateReplyAdmin() throws NoSuchFieldException {
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        1l, new Date(), forumAreaId);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
    
    response.then()
      .statusCode(200);
    
    asAdmin()
      .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
  }

  @Test
  public void testCreateReplyManager() throws NoSuchFieldException {
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        1l, new Date(), forumAreaId);
    
    Response response = asManager()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
    
    response.then()
      .statusCode(200);
    
    asAdmin()
      .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
  }

  @Test
  public void testCreateReplyTeacher() throws NoSuchFieldException {
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        1l, new Date(), forumAreaId);
    
    Response response = asTeacher()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
    
    response.then()
      .statusCode(200);
    
    asAdmin()
      .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
  }

  @Test
  public void testCreateReplyStudent() throws NoSuchFieldException {
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        1l, new Date(), forumAreaId);
    
    Response response = asStudent()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
    
    response.then()
      .statusCode(200);
    
    asAdmin()
      .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
  }
  
  @Test
  public void testListThreadsAdmin() throws NoSuchFieldException {
    asAdmin()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListThreadsManager() throws NoSuchFieldException {
    asManager()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListThreadsTeacher() throws NoSuchFieldException {
    asTeacher()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListThreadsStudent() throws NoSuchFieldException {
    asStudent()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListRepliesAdmin() throws NoSuchFieldException {
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListRepliesManager() throws NoSuchFieldException {
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListRepliesTeacher() throws NoSuchFieldException {
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testListRepliesStudent() throws NoSuchFieldException {
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindThreadAdmin() throws NoSuchFieldException {
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindThreadManager() throws NoSuchFieldException {
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindThreadTeacher() throws NoSuchFieldException {
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }

  @Test
  public void testFindThreadStudent() throws NoSuchFieldException {
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindReplyAdmin() throws NoSuchFieldException {
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindReplyManager() throws NoSuchFieldException {
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindReplyTeacher() throws NoSuchFieldException {
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
  }
  
  @Test
  public void testFindReplyStudent() throws NoSuchFieldException {
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
  }

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
////      Response updateResponse = asRole()
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
//  
////  @Test
////  public void testDeleteAreaGroup() throws NoSuchFieldException {
////    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
////    
////    Response response = asAdmin()
////      .contentType("application/json")
////      .body(areaGroup)
////      .post("/forum/areagroups");
////    
////    Long id = new Long(response.body().jsonPath().getInt("id"));
////
////    Response deleteResponse = asRole()
////      .delete("/forum/areagroups/{ID}", id);
////    assertOk(deleteResponse, forumPermissions, ForumResourcePermissionCollection.FORUM_DELETE_FORUMAREAGROUP, 204);
////    
////    if (deleteResponse.statusCode() == 403) {
////      asAdmin().delete("/forum/areagroups/{ID}?permanent=true", id);
////    }
////  }
}
