package fi.otavanopisto.muikku.rest.test.plugins.announcer;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertEquals;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import fi.otavanopisto.muikku.TestRole;
import fi.otavanopisto.muikku.atests.Announcement;
import fi.otavanopisto.muikku.rest.test.PyramusMocksRest;

public class AnnouncerPermissionsTestsIT extends AbstractAnnouncerRESTTestsIT {

  private Long publicAnnouncementId = null;
  private Long workspace2AnnouncementId = null;

  @Before
  public void beforePublicAnnouncement() {
    Announcement publicAnnouncement = new Announcement(
        null,                           // id, 
        0l,                             // publisherUserEntityId, 
        null,                           // userGroupIds, 
        null,                           // workspaceEntityIds,
        "Test Announcement",            // caption, 
        "Lorem Ipsum",                  // content, 
        new Date(),                     // created, 
        date(100, 1, 1),                // startDate,
        date(150, 12, 31),              // endDate, 
        false,                          // archived, 
        true                            // publiclyVisible
    );
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(publicAnnouncement)
      .post("/announcer/announcements");
    
    publicAnnouncementId = response.body().jsonPath().getLong("id");
  }
  
  @Before
  public void beforeWorkspaceAnnouncement() throws ClassNotFoundException, SQLException {
    List<Long> workspaceEntityIds = new ArrayList<>();
    workspaceEntityIds.add(getWorkspaceEntityIdForIdentifier(PyramusMocksRest.WORKSPACE1_ID.toString()));
    
    Announcement publicAnnouncement = new Announcement(
        null,                           // id, 
        0l,                             // publisherUserEntityId, 
        null,                           // userGroupIds, 
        workspaceEntityIds,             // workspaceEntityIds,
        "Test Announcement",            // caption, 
        "Lorem Ipsum",                  // content, 
        new Date(),                     // created, 
        date(100, 1, 1),                // startDate,
        date(150, 12, 31),              // endDate, 
        false,                          // archived, 
        true                            // publiclyVisible
    );
    
    asAdmin()
      .contentType("application/json")
      .body(publicAnnouncement)
      .post("/announcer/announcements");
  }
  
  @Before
  public void beforeWorkspaceAnnouncement2() throws ClassNotFoundException, SQLException {
    List<Long> workspaceEntityIds = new ArrayList<>();
    workspaceEntityIds.add(getWorkspaceEntityIdForIdentifier(PyramusMocksRest.WORKSPACE2_ID.toString()));
    
    Announcement publicAnnouncement = new Announcement(
        null,                           // id, 
        0l,                             // publisherUserEntityId, 
        null,                           // userGroupIds, 
        workspaceEntityIds,             // workspaceEntityIds,
        "Test Announcement",            // caption, 
        "Lorem Ipsum",                  // content, 
        new Date(),                     // created, 
        date(100, 1, 1),                // startDate,
        date(150, 12, 31),              // endDate, 
        false,                          // archived, 
        true                            // publiclyVisible
    );
    
    Response response = asAdmin()
      .contentType("application/json")
      .body(publicAnnouncement)
      .post("/announcer/announcements");
    
    workspace2AnnouncementId = response.body().jsonPath().getLong("id");
  }
  
  @Before
  public void beforeGroupAnnouncement() {
    List<Long> groupIds = new ArrayList<>();
    groupIds.add(PyramusMocksRest.USERGROUP1_ID);
    
    Announcement publicAnnouncement = new Announcement(
        null,                           // id, 
        0l,                             // publisherUserEntityId, 
        groupIds,                       // userGroupIds, 
        null,                           // workspaceEntityIds,
        "Test Announcement",            // caption, 
        "Lorem Ipsum",                  // content, 
        new Date(),                     // created, 
        date(100, 1, 1),                // startDate,
        date(150, 12, 31),              // endDate, 
        false,                          // archived, 
        false                           // publiclyVisible
    );
    
    asAdmin()
      .contentType("application/json")
      .body(publicAnnouncement)
      .post("/announcer/announcements");
  }
  
  @After
  public void after() {
    permanentDeleteAnnouncements();
  }

  @Test
  public void testFindPublicAnnouncement() throws NoSuchFieldException {
    roles(TestRole.ADMIN, TestRole.MANAGER, TestRole.TEACHER, TestRole.STUDENT).forEach(role -> 
      role.getRequest()
        .get("/announcer/announcements/{ID}", publicAnnouncementId)
        .then()
        .statusCode(200)
    );
  }

  @Test
  public void testNonMemberWorkspaceAnnouncement() throws NoSuchFieldException {
    // Workspace announcement is fetchable via FIND_ANNOUNCEMENT permission
    roles(TestRole.ADMIN, TestRole.MANAGER, TestRole.TEACHER).forEach(role -> { 
      Response response = role.getRequest()
        .get("/announcer/announcements/{ID}", workspace2AnnouncementId);
      assertEquals(String.format("Role %s can not see announcement they should", role.getRole()), 200, response.statusCode());
    });
  }

  @Test
  public void testNonMemberStudentWorkspaceAnnouncement() throws NoSuchFieldException {
    // Student that is not member of a workspace cannot see the announcements

    Response response = asStudent()
      .get("/announcer/announcements/{ID}", workspace2AnnouncementId);
    assertEquals(String.format("Role %s can not see announcement they should", TestRole.STUDENT), 403, response.statusCode());
  }

  @Test
  public void testListAndFindAdmin() {
    /**
     * Manager can see
     *  - The public announcement
     *  - The workspace announcement (member)
     *  - The group announcement (member + special)
     */
    testListAndFind(asAdmin(), TestRole.ADMIN, 3);
  }

  @Test
  public void testListAndFindManager() {
    /**
     * Manager can see
     *  - The public announcement
     *  - The group announcement (special permission)
     */
    testListAndFind(asManager(), TestRole.MANAGER, 2);
  }
  
  @Test
  public void testListAndFindTeacher() {
    /**
     * Teacher can see
     *  - The public announcement
     *  - The group announcement (special permission)
     */
    testListAndFind(asTeacher(), TestRole.TEACHER, 2);
  }

  @Test
  public void testListAndFindStudent() {
    /**
     * Student can see
     *  - The public announcement
     *  - The workspace announcement (member)
     *  - The group announcement (member)
     */
    testListAndFind(asStudent(), TestRole.STUDENT, 3);
  }
  
  private void testListAndFind(RequestSpecification request, TestRole role, int expectedCount) {
    Response response = request.get("/announcer/announcements");
    response.then().statusCode(200).body("id.size()", is(expectedCount));

    List<Long> ids = response.body().jsonPath().getList("id", Long.class);
    for (Long announcementId : ids) {
      switch (role) {
      case ADMIN:
        asAdmin()
        .get("/announcer/announcements/{ID}", announcementId)
        .then()
        .statusCode(200);
        break;
      case MANAGER:
        asManager()
        .get("/announcer/announcements/{ID}", announcementId)
        .then()
        .statusCode(200);
        break;
      case TEACHER:
        asTeacher()
        .get("/announcer/announcements/{ID}", announcementId)
        .then()
        .statusCode(200);
        break;
      case STUDENT:
        asStudent()
        .get("/announcer/announcements/{ID}", announcementId)
        .then()
        .statusCode(200);
        break;
      case EVERYONE:
        asEveryone()
        .get("/announcer/announcements/{ID}", announcementId)
        .then()
        .statusCode(200);
        break;
      default:
        break;
      }
    }
  }
    
}