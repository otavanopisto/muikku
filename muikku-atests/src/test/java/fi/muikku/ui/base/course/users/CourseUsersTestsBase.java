package fi.muikku.ui.base.course.users;

import static fi.muikku.mock.PyramusMock.mocker;

import org.joda.time.DateTime;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.TestUtilities;
import fi.muikku.atests.Workspace;
import fi.muikku.mock.PyramusMock.Builder;
import fi.muikku.mock.model.MockCourseStudent;
import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.pyramus.rest.model.CourseStaffMember;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;
import fi.pyramus.webhooks.WebhookStudentUpdatePayload;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {    
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, workspace.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, workspace.getId(), admin.getId(), 7l);
      mockBuilder.addStudent(student).addCourseStaffMember(workspace.getId(), courseStaffMember).addCourseStudent(workspace.getId(), courseStudent).build();
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
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, workspace.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, workspace.getId(), admin.getId(), 7l);
      mockBuilder.addStudent(student).addCourseStaffMember(workspace.getId(), courseStaffMember).addCourseStudent(workspace.getId(), courseStudent).build();
      try {
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-archive");
        waitAndClick(".archive-button");
        waitForClickable(".workspace-students-list");
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        String payload = objectMapper.writeValueAsString(new WebhookStudentUpdatePayload(2l));
        TestUtilities.webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
        reloadCurrentPage();
        waitForPresent(".workspace-students-list");
        assertNotPresent("div[data-user-id='PYRAMUS-STUDENT-2']");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
      mockBuilder.resetBuilder();
    }
  }
  
  @Test
  public void courseUnarchiveStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, workspace.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, workspace.getId(), admin.getId(), 7l);
      mockBuilder.addStudent(student).addCourseStaffMember(workspace.getId(), courseStaffMember).addCourseStudent(workspace.getId(), courseStudent).build();
      try {
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
        waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-archive");
        waitAndClick(".archive-button");
        waitForClickable(".workspace-students-list");
        waitAndClick(".workspace-students-inactive");
        waitAndClick("div[data-user-id='PYRAMUS-STUDENT-2']>div.workspace-users-unarchive");
        waitAndClick(".unarchive-button");
        waitForClickable(".workspace-students-list");
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
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
