package fi.muikku.rest.test.plugins.forum;

import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import fi.muikku.AbstractRESTPermissionsTest;


@RunWith(Parameterized.class)
public class ForumMessagePermissionsTestsIT extends AbstractRESTPermissionsTest {
//
//  private ForumResourcePermissionCollection forumPermissions = new ForumResourcePermissionCollection();
//  private Long forumAreaId = null;
//  private Long threadId = null;
//  private Long replyId = null;
//  private Long creator = null;
//  
//  /**
//   * createThread
//   * createReply
//   * findThread
//   * findReply
//   * listThreads
//   * listReplies
//   * listLatestThreads
//   */
//  
//  public ForumMessagePermissionsTestsIT(String role) {
//    setRole(role);
//  }
//  
//  @Parameters
//  public static List<Object[]> generateData() {
//    return getGeneratedRoleData();
//  }
//
//  @Before
//  public void before() {
//    creator = Common.ROLEUSERS.get(getFullRoleName());
//    
//    // Create forum
//    
//    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(forum)
//      .post("/forum/areas");
//
//    forumAreaId = new Long(response.body().jsonPath().getInt("id"));
//
//    // Create thread
//    
//    ForumThreadRESTModel thread = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
//        creator, new Date(), forumAreaId, false, false, new Date(), 1l);
//    
//    response = asAdmin()
//      .contentType("application/json")
//      .body(thread)
//      .post("/forum/areas/{ID}/threads", forumAreaId);
//    
//    threadId = new Long(response.body().jsonPath().getInt("id"));
//
//    // Create reply
//    
//    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
//        creator, new Date(), forumAreaId);
//    
//    response = asAdmin()
//      .contentType("application/json")
//      .body(reply)
//      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
//
//    replyId = new Long(response.body().jsonPath().getInt("id"));
//  }
//  
//  @After
//  public void after() {
//    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, replyId);
//    asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, threadId);
//    asAdmin().delete("/forum/areas/{ID}?permanent=true", forumAreaId);
//  }
//  
//  @Test
//  public void testCreateThread() throws NoSuchFieldException {
//    ForumThreadRESTModel areaGroup = new ForumThreadRESTModel(null, "TestCreateThread", "TestCreateThread", 
//        creator, new Date(), forumAreaId, false, false, new Date(), 1l);
//    
//    Response response = asRole()
//      .contentType("application/json")
//      .body(areaGroup)
//      .post("/forum/areas/{ID}/threads", forumAreaId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_WRITEMESSAGES, 200);
//    
//    if (response.statusCode() == 200) {
//      Long id = new Long(response.body().jsonPath().getInt("id"));
//      if (id != null) {
//        asAdmin().delete("/forum/areas/{ID}/threads/{ID2}?permanent=true", forumAreaId, id);
//      }
//    }
//  }
//  
//  @Test
//  public void testCreateReply() throws NoSuchFieldException {
//    ForumThreadReplyRESTModel reply = new ForumThreadReplyRESTModel(null, "TestCreateReply",
//        creator, new Date(), forumAreaId);
//    
//    Response response = asRole()
//      .contentType("application/json")
//      .body(reply)
//      .post("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_WRITEMESSAGES, 200);
//    
//    if (response.statusCode() == 200) {
//      Long id = new Long(response.body().jsonPath().getInt("id"));
//      if (id != null) {
//        asAdmin().delete("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}?permanent=true", forumAreaId, threadId, id);
//      }
//    }
//  }
//  
//  @Test
//  public void testListThreads() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areas/{ID}/threads", forumAreaId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_READMESSAGES, 200);
//  }
//
//  @Test
//  public void testListReplies() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areas/{ID}/threads/{ID2}/replies", forumAreaId, threadId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_READMESSAGES, 200);
//  }
//
//  @Test
//  public void testFindThread() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areas/{ID}/threads/{ID2}", forumAreaId, threadId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_READMESSAGES, 200);
//  }
//
//  @Test
//  public void testFindReply() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areas/{ID}/threads/{ID2}/replies/{ID3}", forumAreaId, threadId, replyId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_READMESSAGES, 200);
//  }
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
