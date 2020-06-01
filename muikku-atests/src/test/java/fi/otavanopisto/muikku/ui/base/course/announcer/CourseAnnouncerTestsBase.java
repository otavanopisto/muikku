package fi.otavanopisto.muikku.ui.base.course.announcer;

import java.sql.Date;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

public class CourseAnnouncerTestsBase extends AbstractUITest {

  @Test
  public void createWorkspaceAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Long courseId = 1l;
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
    .addCourseStaffMember(courseId, courseStaffMember)
    .build();
    try{
      navigate(String.format("/workspace/%s/announcer", workspace.getUrlName()), false);
      waitAndClick(".an-new-announcement");
      
      waitForPresent(".cke_wysiwyg_frame");
      waitForPresent("*[name='endDate']");
      clearElement("*[name='endDate']");
      sendKeys("*[name='endDate']", "21.12.2025");
      
      sendKeys(".mf-textfield-subject", "Test title");
      click(".mf-form-header");
      waitForPresent("#ui-datepicker-div");
      waitForNotVisible("#ui-datepicker-div");
      addTextToCKEditor("Announcer test announcement");
      waitAndClick(".mf-toolbar input[name='send']");
      
      waitForPresent(".an-announcement-topic");
      assertTextIgnoreCase(".an-announcement-topic>span", "Test title");
      assertTextIgnoreCase(".an-announcement-content>p", "Announcer test announcement"); 
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void deleteWorkspaceAnnouncementTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Long courseId = 1l;
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
    .addCourseStaffMember(courseId, courseStaffMember)
    .build();
    try{
      navigate(String.format("/workspace/%s/announcer", workspace.getUrlName()), false);
      waitAndClick(".an-new-announcement");
      
      waitForPresent("*[name='endDate']");
      clearElement("*[name='endDate']");
      sendKeys("*[name='endDate']", "21.12.2025");
      
      sendKeys(".mf-textfield-subject", "Test title");
      click(".mf-form-header h3");
      waitForNotVisible("#ui-datepicker-div");
      addTextToCKEditor("Announcer test announcement");
      waitAndClick(".mf-toolbar input[name='send']");
      
      waitForPresent(".an-announcement-topic");
      waitAndClick(".an-announcement-select input");
      waitAndClick(".mf-items-toolbar .icon-delete");
      waitAndClick(".mf-toolbar input[name='send']");
      reloadCurrentPage();
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".an-announcement-topic>span") == false);
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @SuppressWarnings("deprecation")
  @Test
  public void workspaceAnnouncementVisibleInWorkspaceFrontpageTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 1l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(2l, courseId, student.getId());
    mockBuilder.addCourseStudent(workspace.getId(), mcs).build();
    
    Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null, null);
    updateAnnouncementWorkspace(announcementId, workspace.getId());
    logout();
    mockBuilder
      .mockLogin(student)
      .build();
    try {
      login();
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForPresent(".workspace-announcement-title");
      assertTextIgnoreCase(".workspace-announcement-title", "Test title");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }


  @SuppressWarnings("deprecation")
  @Test
  public void workspaceAnnouncementReadingForStudentTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 1l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(2l, courseId, student.getId());
    mockBuilder.addCourseStudent(workspace.getId(), mcs).build();
   
    Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null, null);
    updateAnnouncementWorkspace(announcementId, workspace.getId());
    logout();
    mockBuilder
      .mockLogin(student)
      .build();
    try {
      login();
      
      navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
      waitForPresent(".workspace-announcement-title");
      click(".workspace-announcement-title");
      waitForPresent("#announcements .announcement-article h2");
      assertTextIgnoreCase("#announcements .announcement-article h2", "Test title");
      assertTextIgnoreCase("#announcements .announcement-article .article-datetime", "12.11.2015");
      waitForPresent("#announcements .announcement-article .article-context");
      assertTextIgnoreCase("#announcements .announcement-article .article-context", "announcer test announcement");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @SuppressWarnings("deprecation")
  @Test
  public void workspaceAnnouncementFrontpageListingForStudentTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 1l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(2l, courseId, student.getId());
    mockBuilder.addCourseStudent(workspace.getId(), mcs).build();
   
    Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null, null);
    updateAnnouncementWorkspace(announcementId, workspace.getId());
    logout();
    mockBuilder
      .mockLogin(student)
      .build();
    try {
      login();
      waitForPresent(".ordered-container__item--basic-announcements .item-list--panel-announcements .item-list__item--announcements");
      assertTextIgnoreCase(".item-list--panel-announcements .item-list__item--announcements .item-list__announcement-caption", "Test title");
      waitForPresent(".item-list--panel-announcements .item-list__item--announcements .item-list__announcement-workspaces .label__text--announcement-workspace");
      assertTextIgnoreCase(".item-list--panel-announcements .item-list__item--announcements .item-list__announcement-workspaces .label__text--announcement-workspace", "testcourse (test extension)");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }

  @SuppressWarnings("deprecation")
  @Test
  public void workspaceAnnouncementFrontpageListingForStudentNotEnrolledTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Long courseId = 1l;
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
   
    Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null, null);
    updateAnnouncementWorkspace(announcementId, workspace.getId());
    logout();
    mockBuilder
      .mockLogin(student)
      .build();
    try {
      login();
      assertNotPresent("#announcements ul>li>div>a");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
