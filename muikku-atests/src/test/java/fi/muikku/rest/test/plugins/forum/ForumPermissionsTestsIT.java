package fi.muikku.rest.test.plugins.forum;

import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import fi.muikku.AbstractRESTPermissionsTest;


@RunWith(Parameterized.class)
public class ForumPermissionsTestsIT extends AbstractRESTPermissionsTest {
//
//  private ForumResourcePermissionCollection forumPermissions = new ForumResourcePermissionCollection();
//  private Long areaId = null;
//  
//  public ForumPermissionsTestsIT(String role) {
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
//    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(forum)
//      .post("/forum/areas");
//    
//    areaId = new Long(response.body().jsonPath().getInt("id"));
//  }
//  
//  @After
//  public void after() {
//    asAdmin().delete("/forum/areas/{ID}?permanent=true", areaId);
//  }
//  
//  @Test
//  public void testCreateEnvironmentForum() throws NoSuchFieldException {
//    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
//    
//    Response response = asRole()
//      .contentType("application/json")
//      .body(forum)
//      .post("/forum/areas");
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM, 200);
//    
//    if (response.statusCode() == 200) {
//      Long id = new Long(response.body().jsonPath().getInt("id"));
//      if (id != null)
//        asAdmin().delete("/forum/areas/{ID}?permanent=true", id);
//    }
//  }
//  
//  @Test
//  public void testListAreas() throws NoSuchFieldException {
//    // Method is unsecured, but the result list is filtered by permission
//    Response response = asRole().get("/forum/areas");
//
//    /**
//     *  Assert that when role has access, the list has exactly the one test forum, otherwise list should be empty
//     */
//    if (roleIsAllowed(forumPermissions, ForumResourcePermissionCollection.FORUM_LISTFORUM)) {
//      response.then().assertThat().statusCode(200).body("id.size()", is(1));
//    } else {
//      response.then().assertThat().statusCode(204);
//    }
//  }
//  
//  @Test
//  public void testFindArea() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areas/{ID}", areaId);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_LISTFORUM, 200);
//  }
//
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
//
//  @Test
//  public void testDeleteForumArea() throws NoSuchFieldException {
//    ForumAreaRESTModel forum = new ForumAreaRESTModel(null, "test_create_environmentforum", null, 0l);
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(forum)
//      .post("/forum/areas");
//
//    Long id = new Long(response.body().jsonPath().getInt("id"));
//
//    Response deleteResponse = asRole()
//      .delete("/forum/areas/{ID}", id);
//    assertOk(deleteResponse, forumPermissions, ForumResourcePermissionCollection.FORUM_DELETEENVIRONMENTFORUM, 204);
//    
//    if (deleteResponse.statusCode() == 403) {
//      asAdmin().delete("/forum/areas/{ID}?permanent=true", id);
//    }
//  }
}
