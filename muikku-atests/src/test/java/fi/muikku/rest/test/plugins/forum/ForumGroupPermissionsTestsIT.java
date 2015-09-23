package fi.muikku.rest.test.plugins.forum;

import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;

import fi.muikku.AbstractRESTPermissionsTest;


@RunWith(Parameterized.class)
public class ForumGroupPermissionsTestsIT extends AbstractRESTPermissionsTest {
//  
//  FORUM_CREATEFORUMAREAGROUP
//  FORUM_LIST_FORUMAREAGROUPS
//  FORUM_FIND_FORUMAREAGROUP
//  FORUM_DELETE_FORUMAREAGROUP
//
//  private Long areaGroupId = null;
//  
//  public ForumGroupPermissionsTestsIT(String role) {
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
//    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(areaGroup)
//      .post("/forum/areagroups");
//    
//    areaGroupId = new Long(response.body().jsonPath().getInt("id"));
//  }
//  
//  @After
//  public void after() {
//    asAdmin().delete("/forum/areagroups/{ID}?permanent=true", areaGroupId);
//  }
//  
//  @Test
//  public void testCreateAreaGroup() throws NoSuchFieldException {
//    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_create_forumareagroup");
//    
//    Response response = asRole()
//      .contentType("application/json")
//      .body(areaGroup)
//      .post("/forum/areagroups");
//    assertOk(response, forumPermissions, FORUM_CREATEFORUMAREAGROUP, 200);
//    
//    if (response.statusCode() == 200) {
//      Long id = new Long(response.body().jsonPath().getInt("id"));
//      if (id != null) {
//        asAdmin().delete("/forum/areagroups/{ID}?permanent=true", id);
//      }
//    }
//  }
//  
//  @Test
//  public void testListAreaGroups() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areagroups");
//    assertOk(response, forumPermissions, FORUM_LIST_FORUMAREAGROUPS, 200);
//  }
//
//  @Test
//  public void testFindAreaGroup() throws NoSuchFieldException {
//    Response response = asRole().get("/forum/areagroups/{ID}", areaGroupId);
//    assertOk(response, forumPermissions, FORUM_FIND_FORUMAREAGROUP, 200);
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
//  @Test
//  public void testDeleteAreaGroup() throws NoSuchFieldException {
//    ForumAreaGroupRESTModel areaGroup = new ForumAreaGroupRESTModel(null, "test_forumareagroup");
//    
//    Response response = asAdmin()
//      .contentType("application/json")
//      .body(areaGroup)
//      .post("/forum/areagroups");
//    
//    Long id = new Long(response.body().jsonPath().getInt("id"));
//
//    Response deleteResponse = asRole()
//      .delete("/forum/areagroups/{ID}", id);
//    assertOk(deleteResponse, forumPermissions, FORUM_DELETE_FORUMAREAGROUP, 204);
//    
//    if (deleteResponse.statusCode() == 403) {
//      asAdmin().delete("/forum/areagroups/{ID}?permanent=true", id);
//    }
//  }
}
