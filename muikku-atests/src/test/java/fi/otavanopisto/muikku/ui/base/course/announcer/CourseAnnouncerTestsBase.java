package fi.otavanopisto.muikku.ui.base.course.announcer;

import java.sql.Date;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
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
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
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
      
      waitForPresent(".application-list__item-content-header");
      assertTextIgnoreCase(".application-list__item-content-header", "Test title");
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
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
    .addCourseStaffMember(courseId, courseStaffMember)
    .build();
    try{
      Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
      updateAnnouncementWorkspace(announcementId, workspace.getId());
      navigate(String.format("/workspace/%s/announcer", workspace.getUrlName()), false);
      
      waitForPresent(".application-list__item-content-header");
      waitAndClick(".form-element--item-selection-container input");
      waitAndClick(".application-panel__toolbar .button-pill--delete");
      sleep(1500);
      waitAndClick(".button--standard-ok");
      assertGoesAway(".application-list__item.announcement", 10);
      reloadCurrentPage();
      waitForPresent(".application-list");
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addCourse(course1).mockLogin(admin).build();
    login();
    

    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
    
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();
    

    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
   
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
      waitForPresent(".reading-panel--announcement");
      assertTextIgnoreCase(".reading-panel--announcement .article__header", "Test title");
      assertTextIgnoreCase(".reading-panel--announcement .article__date", "12.11.2015");
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();

    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
   
    Long announcementId = createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null, null);
    updateAnnouncementWorkspace(announcementId, workspace.getId());
    logout();
    mockBuilder
      .mockLogin(student)
      .build();
    try {
      login();
      waitForPresent(".panel--announcements .item-list--panel-announcements .item-list__announcement-caption");
      assertTextIgnoreCase(".panel--announcements .item-list--panel-announcements .item-list__announcement-caption", "Test title");
      waitForPresent(".panel--announcements .item-list--panel-announcements .label__text--workspace");
      assertTextIgnoreCase(".panel--announcements .item-list--panel-announcements .label__text--workspace", "testcourse (test extension)");
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
      assertNotPresent(".panel--announcements .item-list--panel-announcements .item-list__announcement-caption");
    }finally{
      deleteAnnouncements();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
