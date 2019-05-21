package fi.otavanopisto.muikku.ui.base.course.users;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.webhooks.WebhookStudentUpdatePayload;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(4l, 4l, "Student", "Tester", "teststuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
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
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitForPresent(".tabs__tab-data--workspace-students.active .application-list__item-content-main--workspace-user>div>span");
        assertText(".tabs__tab-data--workspace-students.active .application-list__item-content-main--workspace-user>div>span", "Student Tester");
        
        waitForPresent(".application-sub-panel--workspace-users .application-list--workspace-staff-members .application-list__item-content-main--workspace-user>div");
        assertText(".application-sub-panel--workspace-users .application-list--workspace-staff-members .application-list__item-content-main--workspace-user>div", "Admin Person");
        assertText(".application-sub-panel--workspace-users .application-list--workspace-staff-members .application-list__item-content-main--workspace-user .application-list__item-content-secondary-data", "testadmin@example.com");
      } finally {
        deleteWorkspace(workspace1.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }

  @Test
  public void courseArchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
      MockCourseStudent mcs = new MockCourseStudent(1l, course1.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        navigate(String.format("/workspace/%s/users", workspace1.getUrlName()), false);
        waitAndClick(".tabs__tab-data--workspace-students.active span.icon-delete");
        waitForPresentAndVisible(".button--standard-ok");
        getWebDriver().findElement(By.cssSelector(".button--standard-ok")).isDisplayed();
        waitUntilAnimationIsDone(".dialog--deactivate-reactivate-user");
        sleep(1000);
        waitAndClick(".button--standard-ok");
        
        waitForPresentAndVisible(".tabs__tab-data--workspace-students:not(.active) .application-list__item-content-main--workspace-user>div>span");
        assertText(".tabs__tab-data--workspace-students:not(.active) .application-list__item-content-main--workspace-user>div>span", "Student Tester");
      } finally {
        deleteWorkspace(workspace1.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }
  
  @Test
  public void courseUnarchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      
      Long courseId = 1l;
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addStudent(student)
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();
      try {
        String workspaceUserEntityId = getWorkspaceUserEntityIdByPyramusId("STUDENT-2");
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), false);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        waitAndClick(String.format("div[data-workspaceuserentity-id='%s'] div.workspace-users-archive", workspaceUserEntityId));
        waitAndClick(".archive-button");
        waitForClickable(".workspace-students-inactive");
        waitAndClick(".workspace-students-inactive");
        waitAndClick(String.format("div[data-workspaceuserentity-id='%s'] div.workspace-users-unarchive", workspaceUserEntityId));
        waitAndClick(".unarchive-button");
        waitForPresentAndVisible(".workspace-students-listing-wrapper");
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(2l));
        TestUtilities.webhookCall("http://dev.muikku.fi:" + getPortHttp() + "/pyramus/webhook", payload);
        reloadCurrentPage();
        waitForPresent(".workspace-students-list");
        waitAndClick(".workspace-students-active");
        waitForPresent(".workspace-students-list");
        assertPresent(String.format("div[data-workspaceuserentity-id='%s']", workspaceUserEntityId));
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }
  
}
