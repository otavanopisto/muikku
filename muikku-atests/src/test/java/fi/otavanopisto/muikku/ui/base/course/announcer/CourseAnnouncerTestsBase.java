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
      waitAndClick(".button--primary-function");
      waitForPresent(".cke_contents");
      waitForPresent(".env-dialog__input--date-picker");
      click(".env-dialog__input--date-picker");
      waitForPresent(".react-datepicker-popper");
      click(".env-dialog__header");
      waitForNotVisible(".react-datepicker-popper");
      sendKeys(".env-dialog__form-element-container--title>input", "Test title");
      addTextToCKEditor("Announcer test announcement");
      waitAndClick(".button--dialog-execute");
      
      waitForPresent(".application-list-document-short-header");
      assertTextIgnoreCase(".application-list-document-short-header", "Test title");
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
      
      waitAndClick(".button--primary-function");
      waitForPresent(".cke_contents");
      waitForPresent(".env-dialog__input--date-picker");
      click(".env-dialog__input--date-picker");
      waitForPresent(".react-datepicker-popper");
      click(".env-dialog__header");
      waitForNotVisible(".react-datepicker-popper");
      sendKeys(".env-dialog__form-element-container--title>input", "Test title");
      addTextToCKEditor("Announcer test announcement");
      waitAndClick(".button--dialog-execute");
      
      waitForPresent(".application-list-document-short-header");
      waitAndClick(".announcement__select-container input");
      waitAndClick(".application-panel__toolbar .button-pill--delete");
      waitAndClick(".button--standard-ok");
      
      reloadCurrentPage();
      reloadCurrentPage();
      
      waitForPresent(".application-list");
      scrollToEnd();

      
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".application-list__item-footer") == false);
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
      waitForPresent(".item-list__announcement-caption");
      assertTextIgnoreCase(".item-list__announcement-caption", "Test title");
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
      waitForPresent(".item-list__announcement-caption");
      click(".item-list__announcement-caption");
      waitForPresent(".item-list__item--has-workspaces");
      assertTextIgnoreCase(".item-list__item--has-workspaces .item-list__announcement-caption", "Test title");
      assertTextIgnoreCase(".item-list__item--has-workspaces .item-list__announcement-date", "12.11.2015");
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
      waitForPresent(".ordered-container__item--basic-announcements .item-list--panel-announcements .item-list__item--has-workspaces");
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
      assertNotPresent(".item-list--panel-announcements a");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
