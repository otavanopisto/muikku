package fi.otavanopisto.muikku.ui.base.tor;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
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

public class ToRTestsBase extends AbstractUITest {
  
  @Test
  public void recordsWorkspaceEvaluationTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
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
      assertText(".application-list__item-header--course .application-list__header-primary", "testcourses (test extension)");
      
      waitForPresent(".application-list__item-header--course .application-list__indicator-badge--course");
      assertText(".application-list__item-header--course .application-list__indicator-badge--course", "E");
      
      waitAndClick(".application-list__item-header--course .application-list__header-primary");
      waitForPresent(".application-sub-panel__text--course-evaluation");
      assertText(".application-sub-panel__text--course-evaluation", "Test evaluation.");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void recordsExerciseEvaluationTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 1l;
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
        "Test exercise", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try{        
        logout();
        mockBuilder.mockLogin(student);
        login();
  
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
        waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
        waitForPresentAndVisible(".notification-queue-item-success");
        waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        navigate(String.format("/evaluation2"), false);
        waitAndClick(".evaluate-button");
        waitAndClick(".assignment-title-wrapper");
        waitForPresentAndVisible(".assignment-wrapper .muikku-text-field");
        assertTextIgnoreCase(".assignment-wrapper .muikku-text-field", "field value");
        waitAndClick(".assignment-evaluate-button");
        waitUntilAnimationIsDone("#evaluationAssignmentEvaluateContainer");
        waitForElementToBeClickable("#evaluationAssignmentEvaluateContainer .evaluation-modal-evaluate-form #cke_assignmentEvaluateFormLiteralEvaluation .cke_contents");
        getWebDriver().switchTo().frame(findElementByCssSelector("#evaluationAssignmentEvaluateContainer .evaluation-modal-evaluate-form #cke_assignmentEvaluateFormLiteralEvaluation .cke_wysiwyg_frame"));
        sendKeys(".cke_contents_ltr", "Test evaluation.");
        getWebDriver().switchTo().defaultContent();
        
        selectOption("#workspaceGradeGrade", "PYRAMUS-1@PYRAMUS-1");
  
        waitAndClick("#assignmentSaveButton");
        waitForPresent(".notification-queue-item-success");
        waitForPresentAndVisible(".assignment-wrapper .assignment-evaluated-label");
        waitForPresentAndVisible(".assignment-wrapper .assignment-grade .assignment-grade-data");          
        assertTextIgnoreCase(".assignment-wrapper .assignment-grade .assignment-grade-data", "Excellent");
        
        logout();
        mockBuilder.mockLogin(student);
        login();
        
        navigate("/records#records", false);
        waitForPresent(".application-list__header-primary");
        waitAndClick(".application-list__header-primary");
        waitForPresent(".application-list__indicator-badge--task");
        assertText(".application-list__indicator-badge--task", "E");
        waitAndClick(".application-list__item-header--studies-assignment");
        waitForVisible(".application-sub-panel__text--task-evaluation p");
        assertTextIgnoreCase(".application-sub-panel__text--task-evaluation p", "Test evaluation.");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void studiesSummaryTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(4l, 4l, "Studenter", "Tester", "studenter@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.toDate(2035, 1, 1));
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 1l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .addCourse(course1)
        .mockLogin(admin)
        .build();
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(4l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .mockStudentCourseStats(student.getId(), 10).build()
        .build();
   
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test exercise", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try{        
        logout();
        mockBuilder.mockLogin(student);
        login();

        selectFinnishLocale();        
        navigate("/records", false);

        waitForPresent(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title", "Opintojen alkamispäivämäärä");        
        waitForPresent(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item-data--summary-start-date");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item-data--summary-start-date span", "01.01.2012");

        waitForPresent(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title", "Opinto-oikeuden päättymispäivämäärä");
        waitForPresent(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item-data--summary-end-date");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-dates .application-sub-panel__item-data--summary-end-date span", "01.01.2035");
        
        waitForPresent(".application-sub-panel__card-header--summary-evaluated");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-evaluated", "Kurssisuoritukset");
        waitForPresent(".application-sub-panel__card-highlight--summary-evaluated");
        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-evaluated", "0");
        
        waitForPresent(".application-sub-panel__card-header--summary-activity");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-activity", "Aktiivisuus");
        waitForPresent(".application-sub-panel__card-highlight--summary-activity");
//        TODO: Depending on the order tests are run this number can be anything between 1-4 so commenting for now
//        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-activity", "1");

        waitForPresent(".application-sub-panel__card-header--summary-returned");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-returned", "Palautetut tehtävät");
        waitForPresent(".application-sub-panel__card-highlight--summary-returned");
        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-returned", "0");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
}