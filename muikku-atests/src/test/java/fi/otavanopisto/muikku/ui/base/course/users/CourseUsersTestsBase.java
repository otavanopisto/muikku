package fi.otavanopisto.muikku.ui.base.course.users;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;


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

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(4l, 4l, "Student", "Tester", "testrdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(5l, 5l, "Student", "Teste", "testserdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student3 = new MockStudent(6l, 6l, "Student", "Test", "teststrdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student4 = new MockStudent(7l, 7l, "Student", "Tes", "teststuenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).addStudent(student3).addStudent(student4).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent mcs2 = new MockCourseStudent(2l, course1.getId(), student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent mcs3 = new MockCourseStudent(3l, course1.getId(), student3.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent mcs4 = new MockCourseStudent(4l, course1.getId(), student4.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));

      CourseStaffMember courseStaffMember = new CourseStaffMember(5l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStudent(course1.getId(), mcs2)
        .addCourseStudent(course1.getId(), mcs3)
        .addCourseStudent(course1.getId(), mcs4)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitForPresent(".application-list__item--workspace-user:nth-of-type(4) .application-list__item-content-primary-data>span");
        assertText(".application-list__item--workspace-user:nth-of-type(4) .application-list__item-content-primary-data>span", "Student Tester");
        
        waitForElementToAppear(".application-list--workspace-staff-members .application-list__item--workspace-staff-member .application-list__item-content-main--workspace-user>div:first-child", 3, 5000);
        assertText(".application-list--workspace-staff-members .application-list__item--workspace-staff-member .application-list__item-content-main--workspace-user>div:first-child", "Admin Person");
        assertText(".application-list--workspace-staff-members .application-list__item--workspace-staff-member .application-list__item-content-main--workspace-user .application-list__item-content-secondary-data", "testadmin@example.com");
      } finally {
        deleteWorkspace(workspace1.getId());
        archiveUserByEmail(student.getEmail());
        archiveUserByEmail(student2.getEmail());
        archiveUserByEmail(student3.getEmail());
        archiveUserByEmail(student4.getEmail());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseArchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Student", "Tester", "teststuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitAndClick(".application-list--workspace-users .application-list__item-content-actions .icon-trash");
        waitForVisible(".button--standard-ok");
        waitUntilAnimationIsDone(".dialog--deactivate-reactivate-user");
        sleep(1000);
        waitAndClick(".button--standard-ok");
        waitForVisible(".tabs__tab-data--workspace-students:not(.active) .application-list__item--workspace-user span");
        assertText(".tabs__tab-data--workspace-students:not(.active) .application-list__item--workspace-user span", "Student Tester");
      } finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseUnarchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Student", "Tester", "teststuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitAndClick(".application-list--workspace-users .application-list__item-content-actions .icon-trash");
        waitForVisible(".button--standard-ok");
        waitUntilAnimationIsDone(".dialog--deactivate-reactivate-user");
        sleep(1000);
        waitAndClickAndConfirmVisibilityGoesAway(".button--standard-ok", ".dialog--deactivate-reactivate-user", 3, 2000);
        waitForVisible(".tabs__tab-data--workspace-students:not(.active) .application-list__item--workspace-user .application-list__item-content-actions .icon-back");
        waitForNotPresent(".dialog--deactivate-reactivate-user");
        waitAndClick(".tabs__tab-data--workspace-students:not(.active) .application-list__item--workspace-user .application-list__item-content-actions .icon-back");
        waitUntilAnimationIsDone(".dialog--deactivate-reactivate-user");
        sleep(1000);
        waitAndClickAndConfirmVisibilityGoesAway(".button--standard-ok", ".dialog--deactivate-reactivate-user", 3, 2000);
        waitForPresent(".application-list__item-content-main--workspace-user .application-list__item-content-primary-data>span");
        assertText(".application-list__item-content-main--workspace-user .application-list__item-content-primary-data>span", "Student Tester");
      } finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseUsersListSendMessageToStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Student", "Tester", "teststuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitAndClick(".application-list--workspace-users .application-list__item-content-actions .icon-envelope");
        waitForVisible(".env-dialog--new-message.visible .autocomplete__input .tag-input__selected-item");
        assertText(".env-dialog--new-message.visible .autocomplete__input .tag-input__selected-item", "Student Tester");
        
        waitForVisible(".env-dialog__footer .env-dialog__actions .button--dialog-execute");
        scrollIntoView(".env-dialog__footer .env-dialog__actions .button--dialog-execute");
        sleep(500);
        waitAndClick(".env-dialog__footer .env-dialog__actions .button--dialog-execute");
        waitForVisible(".notification-queue__item--success");
        
        logout();
        mockBuilder.mockLogin(student);
        login();
        
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Admin Person");
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Test (test extension)");
      } finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
}