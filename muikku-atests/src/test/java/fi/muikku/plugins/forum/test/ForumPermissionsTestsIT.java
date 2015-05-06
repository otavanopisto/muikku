package fi.muikku.plugins.forum.test;

import static com.jayway.restassured.RestAssured.given;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import com.jayway.restassured.response.Response;

import fi.muikku.AbstractRESTPermissionsTest;
import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.muikku.plugins.forum.rest.ForumAreaRESTModel;


@RunWith(Parameterized.class)
public class ForumPermissionsTestsIT extends AbstractRESTPermissionsTest {

  private ForumResourcePermissionCollection forumPermissions = new ForumResourcePermissionCollection();
  
  @Parameters
  public static List<Object[]> generateData() {
    return getGeneratedRoleData();
  }
  
  public ForumPermissionsTestsIT(String role) {
    this.role = role;
  }
  
  @Test
  public void testCreateEnvironmentForum() throws NoSuchFieldException {
    ForumAreaRESTModel contactURLType = new ForumAreaRESTModel(null, "test_create_environmentforum", null);
    
    Response response = asRole()
      .contentType("application/json")
      .body(contactURLType)
      .post("/forum/areas");
    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_CREATEENVIRONMENTFORUM, 200);
    
//    Long statusCode = new Long(response.statusCode());
//    Long id = null;
//    if (statusCode.toString().equals("200")) {
//      id = new Long(response.body().jsonPath().getInt("id"));
//      if (!id.equals(null)) {
//        given().headers(getAdminAuthHeaders())
//        .delete("/common/contactURLTypes/{ID}?permanent=true", id);
//      }
//    }
  }
  
//  @Test
//  public void testListAreas() throws NoSuchFieldException {
//    Response response = given().headers(getAuthHeaders())
//      .get("/forum/areas");
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.forum_listLIST_CONTACTURLTYPES, 200);
//  }
//  
//  @Test
//  public void testFindArea() throws NoSuchFieldException {
//    Response response = given().headers(getAuthHeaders())
//      .get("/forum/areas/{ID}", 1);
//    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FIND_CONTACTURLTYPE, 200);
//  }

//  testUpdate
//  testDelete
  
//  @Test
//  public void testUpdateContactURLType() throws NoSuchFieldException {
//    ContactURLType contactURLType = new ContactURLType(null, "Not Updated", Boolean.FALSE);
//    
//    Response response = given().headers(getAdminAuthHeaders())
//      .contentType("application/json")
//      .body(contactURLType)
//      .post("/common/contactURLTypes");
//    
//    Long id = new Long(response.body().jsonPath().getInt("id"));
//    try {
//      ContactURLType updateContactURLType = new ContactURLType(id, "Updated", Boolean.FALSE);
//
//      Response updateResponse = given().headers(getAuthHeaders())
//        .contentType("application/json")
//        .body(updateContactURLType)
//        .put("/common/contactURLTypes/{ID}", id);
//      assertOk(updateResponse, forumPermissions, CommonPermissions.UPDATE_CONTACTURLTYPE, 200);
//
//    } finally {
//      given().headers(getAdminAuthHeaders())
//        .delete("/common/contactURLTypes/{ID}?permanent=true", id);
//    }
//  }
//  
//  @Test
//  public void testPermissionsDeleteContactURLType() throws NoSuchFieldException {
//    ContactURLType contactURLType = new ContactURLType(null, "create type", Boolean.FALSE);
//    
//    Response response = given().headers(getAdminAuthHeaders())
//      .contentType("application/json")
//      .body(contactURLType)
//      .post("/common/contactURLTypes");
//    
//    Long id = new Long(response.body().jsonPath().getInt("id"));
//
//    Response deleteResponse = given().headers(getAuthHeaders())
//      .delete("/common/contactURLTypes/{ID}", id);
//    assertOk(deleteResponse, forumPermissions, CommonPermissions.DELETE_CONTACTURLTYPE, 204);
//    
//    given().headers(getAdminAuthHeaders())
//      .delete("/common/contactURLTypes/{ID}?permanent=true", id);
//  }
}
