package fi.otavanopisto.muikku.rest.test.plugins.forum;

import java.util.Date;

import org.junit.Test;

import com.jayway.restassured.response.Response;

import fi.otavanopisto.muikku.AbstractRESTTest;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumAreaRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadRESTModel;
import fi.otavanopisto.muikku.plugins.forum.rest.ForumThreadReplyRESTModel;

public class ForumMessagePermissionsTestsIT extends AbstractRESTTest { 
  @Test
  public void testCreateThreadAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
        1l, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    response.then()
      .statusCode(200);
    
    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testCreateThreadManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
          1l, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
      
      response = asManager()
        .contentType("application/json")
        .body(areaGroup)
        .post("/forum/areas/{ID}/threads", forumAreaId);
      
      response.then()
        .statusCode(200);
      
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testCreateThreadTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
          1l, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
      
      response = asTeacher()
        .contentType("application/json")
        .body(areaGroup)
        .post("/forum/areas/{ID}/threads", forumAreaId);
      
      response.then()
        .statusCode(200);
      
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testCreateThreadStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
          1l, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
      
      response = asStudent()
        .contentType("application/json")
        .body(areaGroup)
        .post("/forum/areas/{ID}/threads", forumAreaId);
      
      response.then()
        .statusCode(200);
      
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testCreateReplyAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadReplyRESTModel reply2 = new ForumThreadReplyRESTModel(null, "TestCreateReply",
          1l, new Date(), forumAreaId, null, new Date(), 0l);
      
      response = asAdmin()
        .contentType("application/json")
        .body(reply2)
        .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
      
      response.then()
        .statusCode(200);
      
      asAdmin()
        .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }

  @Test
  public void testCreateReplyManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadReplyRESTModel reply2 = new ForumThreadReplyRESTModel(null, "TestCreateReply",
          1l, new Date(), forumAreaId, null, new Date(), 0l);
      
      response = asManager()
        .contentType("application/json")
        .body(reply2)
        .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
      
      response.then()
        .statusCode(200);
      
      asAdmin()
        .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }

  @Test
  public void testCreateReplyTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadReplyRESTModel reply2 = new ForumThreadReplyRESTModel(null, "TestCreateReply",
          1l, new Date(), forumAreaId, null, new Date(), 0l);
      
      response = asTeacher()
        .contentType("application/json")
        .body(reply2)
        .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
      
      response.then()
        .statusCode(200);
      
      asAdmin()
        .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }

  }

  @Test
  public void testCreateReplyStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
      ForumThreadReplyRESTModel reply2 = new ForumThreadReplyRESTModel(null, "TestCreateReply",
          1l, new Date(), forumAreaId, null, new Date(), 0l);
      
      response = asStudent()
        .contentType("application/json")
        .body(reply2)
        .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
      
      response.then()
        .statusCode(200);
      
      asAdmin()
        .delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, new Long(response.body().jsonPath().getInt("id")));
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListThreadsAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asAdmin()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListThreadsManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asManager()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListThreadsTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asTeacher()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListThreadsStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asStudent()
      .get("/forum/areas/{ID}/threads", forumAreaId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListRepliesAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListRepliesManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListRepliesTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testListRepliesStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindThreadAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindThreadManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindThreadTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }

  @Test
  public void testFindThreadStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindReplyAdmin() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asAdmin()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindReplyManager() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asManager()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindReplyTeacher() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asTeacher()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
  }
  
  @Test
  public void testFindReplyStudent() throws NoSuchFieldException {
    Long forumAreaId = null;
    Long threadId = null;
    Long replyId = null;
    
    Long creator = 1l;
    
    // Create forum
    
    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(forum)
      .post("/forum/areas");

    forumAreaId = new Long(response.body().jsonPath().getInt("id"));

    // Create thread
    
    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", creator, new Date(), forumAreaId, false, false, new Date(), 1l, new Date());
    
    response = asAdmin()
      .contentType("application/json")
      .body(thread)
      .post("/forum/areas/{ID}/threads", forumAreaId);
    
    threadId = new Long(response.body().jsonPath().getInt("id"));

    // Create reply
    
    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
        creator, new Date(), forumAreaId, null, new Date(), 0l);
    
    response = asAdmin()
      .contentType("application/json")
      .body(reply)
      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);

    replyId = new Long(response.body().jsonPath().getInt("id"));
    try{
    asStudent()
      .get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId)
      .then()
      .statusCode(200);
    }finally{
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
      asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
      asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
    }
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
