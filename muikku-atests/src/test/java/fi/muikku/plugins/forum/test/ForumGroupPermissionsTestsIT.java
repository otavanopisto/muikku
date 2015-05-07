package fi.muikku.plugins.forum.test;

import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import com.jayway.restassured.response.Response;

import fi.muikku.AbstractRESTPermissionsTest;
import fi.muikku.plugins.forum.ForumResourcePermissionCollection;
import fi.muikku.plugins.forum.rest.ForumAreaGroupRESTModel;


@RunWith(Parameterized.class)
public class ForumGroupPermissionsTestsIT extends AbstractRESTPermissionsTest {

  private ForumResourcePermissionCollection forumPermissions = new ForumResourcePermissionCollection();
  private Long areaGroupId = null;
  
  public ForumGroupPermissionsTestsIT(String role) {
    setRole(role);
  }
  
  @Parameters
  public static List<Object[]> generateData() {
    return getGeneratedRoleData();
  }

  @Before
  public void before() {
//    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(areaGroup)
//      .post("/forum/areagroups");
//    
//    areaGroupId = new Long(response.body().jsonPath().getInt("id"));
  }
  
  @After
  public void after() {
//    asAdmin().delete("/forum/areagroups/{ID}?permanent=true", areaGroupId);
  }
  
  @Test
  public void testCreateAreaGroup() throws NoSuchFieldException {
    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
    
    Response response = asRole()
      .contentType("application/json")
      .body(areaGroup)
      .post("/forum/areagroups");
    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_CREATEFORUMAREAGROUP, 200);
    
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
  
  @Test
  public void testListAreaGroups() throws NoSuchFieldException {
    Response response = asRole().get("/forum/areagroups");
    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS, 200);
  }

//  @Test
  public void testSearchUsers() throws NoSuchFieldException {
    Response response = asRole().get("/user/users?searchString=a");
    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_LIST_FORUMAREAGROUPS, 200);
  }
  
//  @Test
  public void testFindAreaGroup() throws NoSuchFieldException {
    Response response = asRole().get("/forum/areagroups/{ID}", 1);
    assertOk(response, forumPermissions, ForumResourcePermissionCollection.FORUM_FIND_FORUMAREAGROUP, 200);
  }

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
//      Response updateResponse = asRole()
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
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(contactURLType)
//      .post("/common/contactURLTypes");
//    
//    Long id = new Long(response.body().jsonPath().getInt("id"));
//
//    Response deleteResponse = asRole()
//      .delete("/common/contactURLTypes/{ID}", id);
//    assertOk(deleteResponse, forumPermissions, CommonPermissions.DELETE_CONTACTURLTYPE, 204);
//    
//    given().headers(getAdminAuthHeaders())
//      .delete("/common/contactURLTypes/{ID}?permanent=true", id);
//  }
}
