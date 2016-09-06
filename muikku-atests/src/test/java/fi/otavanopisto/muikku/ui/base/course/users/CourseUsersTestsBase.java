package fi.otavanopisto.muikku.ui.base.course.users;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

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
import fi.otavanopisto.pyramus.webhooks.WebhookStudentUpdatePayload;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {    
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
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
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        assertText(".workspace-students-listing-wrapper .workspace-users-name", "Tester, Student (Test Study Programme)");
        waitForPresent(".workspace-teachers-listing-wrapper .workspace-users-name");
        assertText(".workspace-teachers-listing-wrapper .workspace-users-name", "User, Admin");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }

  @Test
  public void courseArchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
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
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-archive");
        waitAndClick(".archive-button");
        waitForPresentAndVisible(".workspace-students-listing-wrapper");
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(2l));
        TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
        reloadCurrentPage();
        waitForPresent(".workspace-students-list");
        assertNotPresent("div[data-user-id='PYRAMUS-STUDENT-2']");
      } finally {
        deleteWorkspace(workspace.getId());
      }
      
    } finally {
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
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-archive");
        waitAndClick(".archive-button");
        waitForClickable(".workspace-students-inactive");
        waitAndClick(".workspace-students-inactive");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-unarchive");
        waitAndClick(".unarchive-button");
        waitForPresentAndVisible(".workspace-students-listing-wrapper");
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(2l));
        TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
        reloadCurrentPage();
        waitForPresent(".workspace-students-list");
        waitAndClick(".workspace-students-active");
        waitForPresent(".workspace-students-list");
        assertPresent("div[data-user-id='PYRAMUS-STUDENT-2']");      
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }
  
}
