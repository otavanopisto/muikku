package fi.otavanopisto.muikku.wcag.records;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class RecordsAT extends AbstractWCAGTest{
  
  @Test
  public void recordsWorkspaceEvaluationTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 2l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .addCourse(course1)
        .mockLogin(admin)
        .build();
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
      mockBuilder
      .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
      .mockCompositeGradingScales()
      .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, date)
      .mockCompositeCourseAssessmentRequests()
      .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, admin.getId(), date)
      .mockStaffCompositeCourseAssessmentRequests()      
      .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, course1, student, admin.getId(), date)
      .mockStaffCompositeCourseAssessmentRequests()
      .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello! I'd like to get assessment.", false, true, date)
      .mockCourseAssessments(courseStudent, admin)
      .mockStudentCourseStats(student.getId(), 10).build();
      
      logout();
      mockBuilder.mockLogin(student);
      login();
      
      navigate("/records#records", false);
      waitForPresent(".application-list__item-header--course .application-list__header-primary");
      testAccessibility("Records view:");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void recordsViewTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 3l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .addCourse(course1)
        .mockLogin(admin)
        .build();
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .mockStudentCourseStats(student.getId(), 10)
        .build();
      try {
        logout();
        mockBuilder.mockLogin(student).mockMatriculationEligibility(true);
        login();
        navigate("/records#hops", false);
        waitAndClick(".form-element__radio-option-container #goalMatriculationExamyes");
        waitForPresentXPath("//a[@href='#yo']");
        testAccessibility("Records view HOPS");
        navigate("/records", false);
        waitForVisible(".filter--graph-filter");
        testAccessibility("Records view summary");
      }finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
}
