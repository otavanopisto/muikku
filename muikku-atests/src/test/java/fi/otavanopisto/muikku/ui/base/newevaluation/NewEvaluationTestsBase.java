package fi.otavanopisto.muikku.ui.base.newevaluation;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourse;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class NewEvaluationTestsBase extends AbstractUITest {
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void evaluateStudentWorkspaceTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      Long courseId = 2l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourses", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
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
      logout();
      mockBuilder.mockLogin(student);
      login();
    
      navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
      selectFinnishLocale();
      waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
      assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "");
      waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
      waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "field value");
      waitForVisible(".material-page__field-answer-synchronizer--saved");
      waitAndClick(".button--muikku-submit-assignment");

      waitForElementToBeClickable(".button--muikku-withdraw-assignment");
      
      mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests();
      
      logout();
      mockBuilder.mockLogin(admin);
      login();
      navigate(String.format("/evaluation2"), false);
      waitAndClick(".evaluate-button");
      
      waitForPresent(".eval-modal-evaluate-buttonset .button-start-evaluation");
      waitAndClick(".eval-modal-evaluate-buttonset .button-start-evaluation");
      
      waitUntilAnimationIsDone(".eval-modal #workspaceGradeEditorContainer");
      if(getBrowser().equals("chrome_headless")) {
        sleep(500);
      }

      waitForPresent("#workspaceGradeEditorContainer .eval-modal-evaluate-workspace-content #cke_workspaceGradeText .cke_contents");
      getWebDriver().switchTo().frame(findElementByCssSelector("#workspaceGradeEditorContainer .eval-modal-evaluate-workspace-content #cke_workspaceGradeText .cke_wysiwyg_frame"));
      sendKeys(".cke_contents_ltr", "Test evaluation.");
      getWebDriver().switchTo().defaultContent();
      
      selectOption("#workspaceGradeGrade", "PYRAMUS-1@PYRAMUS-1");
      
      mockBuilder
      .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
      .mockStaffCompositeCourseAssessmentRequests()
      .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, date);
    
      mockBuilder.mockCourseAssessments(courseStudent, admin);          
      waitAndClick("#workspaceGradeSave");
      waitForPresent(".notification-queue-item-success");
      waitAndClick(".remove-button .ui-button-text");
      assertVisible(".evaluation-well-done-container");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void evaluateStudentWorkspaceExerciseTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 1l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);

      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
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
        selectFinnishLocale();
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "");
        waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "field value");
        waitForVisible(".material-page__field-answer-synchronizer--saved");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");        
        
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        navigate(String.format("/evaluation2"), false);
        waitAndClick(".evaluate-button");
        waitAndClick(".assignment-title-wrapper");
        waitForVisible(".assignment-wrapper .muikku-text-field");
        waitUntilContentChanged(".assignment-wrapper .muikku-text-field", "");
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
        waitForVisible(".assignment-wrapper .assignment-evaluated-label");
        waitForVisible(".assignment-wrapper .assignment-grade .assignment-grade-data");          
        assertTextIgnoreCase(".assignment-wrapper .assignment-grade .assignment-grade-data", "Excellent");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void evaluationCardOrderingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Apprentice", "Master", "maprentice@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111109-1212", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStudent(student2).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 3l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);

      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      MockCourseStudent courseStudent2 = new MockCourseStudent(3l, courseId, student2.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .addCourseStudent(courseId, courseStudent2)
        .build();
   
      createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      try{
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockAssessmentRequests(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .addCompositeCourseAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, date.minusDays(2l))
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .addStaffCompositeAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, admin.getId(), date.minusDays(2l))
        .mockStaffCompositeCourseAssessmentRequests();
        
        navigate(String.format("/evaluation2"), false);
        
        waitForPresent(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
        
        waitAndClick(".icon-sort-amount-desc");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        
        waitAndClick(".icon-sort-amount-asc");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");

        waitAndClick(".icon-sort-alpha-desc");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        
        waitAndClick(".icon-sort-alpha-asc");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        assertTextIgnoreCase(".evaluation-card .evaluation-card-title .evaluation-card-student:nth-child(1)", "master, apprentice");
        } finally {
          deleteWorkspace(workspace.getId());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void evaluationVisibleInMaterialViewTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 1l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
  
      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
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
        selectFinnishLocale();
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "");
        waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "field value");
        waitForVisible(".material-page__field-answer-synchronizer--saved");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");        

        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        navigate(String.format("/evaluation2"), false);
        waitAndClick(".evaluate-button");
        waitAndClick(".assignment-title-wrapper");
        waitForVisible(".assignment-wrapper .muikku-text-field");
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
        waitForVisible(".assignment-wrapper .assignment-evaluated-label");
        waitForVisible(".assignment-wrapper .assignment-grade .assignment-grade-data");          
        assertTextIgnoreCase(".assignment-wrapper .assignment-grade .assignment-grade-data", "Excellent");
        
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__assignment-assessment");
        assertText(".material-page__assignment-assessment .material-page__assignment-assessment-literal-data>p", "Test evaluation.");
        waitForVisible(".material-page__assignment-assessment .material-page__assignment-assessment-grade-data");
        assertText(".material-page__assignment-assessment .material-page__assignment-assessment-grade-data", "Excellent");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void evaluationRequestImportanceOrderingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Apprentice", "Master", "maprentice@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111109-1212", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student3 = new MockStudent(4l, 4l, "Anotha", "Student", "hurhurhrurh@example.com", 1l, OffsetDateTime.of(1992, 3, 1, 0, 0, 0, 0, ZoneOffset.UTC), "010392-2145", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStudent(student2).addStudent(student3).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 3l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
  
      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      MockCourseStudent courseStudent2 = new MockCourseStudent(3l, courseId, student2.getId());
      MockCourseStudent courseStudent3 = new MockCourseStudent(4l, courseId, student3.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .addCourseStudent(courseId, courseStudent2)
        .addCourseStudent(courseId, courseStudent3)
        .build();
   
      createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      try{
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockAssessmentRequests(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, date)
        .mockAssessmentRequests(student3.getId(), courseId, courseStudent3.getId(), "Tsadaam!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .addCompositeCourseAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, date.minusDays(2l))
        .addCompositeCourseAssessmentRequest(student3.getId(), courseId, courseStudent3.getId(), "Tsadaam!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student3, date.minusDays(1l))
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .addStaffCompositeAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, admin.getId(), date.minusDays(2l))
        .addStaffCompositeAssessmentRequest(student3.getId(), courseId, courseStudent3.getId(), "Tsadaam!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student3, admin.getId(), date.minusDays(1l))
        .mockStaffCompositeCourseAssessmentRequests();
        
        navigate(String.format("/evaluation2"), false);
        
        waitForPresent(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
        waitForPresent("div[data-user-entity-id=\"1\"]");
        waitAndClick("div[data-user-entity-id=\"1\"] .evaluation-important-button");
        
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        
        waitAndClick(".icon-sort-alpha-desc");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        waitUntilTextChanged(".evaluation-card:nth-child(2) .evaluation-card-title .evaluation-card-student", "master, apprentice");
        assertTextIgnoreCase(".evaluation-card:nth-child(2) .evaluation-card-title .evaluation-card-student", "student, anotha");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");
        
        waitAndClick("div[data-user-entity-id=\"1\"] .evaluation-unimportant-button");
        waitAndClick(".icon-sort-alpha-asc");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "tester, student");        
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card-title .evaluation-card-student", "master, apprentice");
      } finally {
          deleteWorkspace(workspace.getId());
        }
      } finally {
        mockBuilder.wiremockReset();
      }
    }

  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX
    }
  )
  public void evaluationSupplemenetationRequestTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      
      Long courseId = 1l;
      
      login();
      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);

      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end);
      
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
        selectFinnishLocale();
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "");
        waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input");
        waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .material-page__textfield input", "field value");
        waitForVisible(".material-page__field-answer-synchronizer--saved");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        selectFinnishLocale();
        navigate(String.format("/evaluation2"), false);
        waitAndClick(".evaluate-button");
        waitAndClick(".eval-modal-evaluate-buttonset .button-supplementation-request");

        waitUntilAnimationIsDone("#workspaceSupplementationEditorContainer");
        
        waitForElementToBeClickable("#workspaceSupplementationEditorContainer #cke_workspaceSupplementationText .cke_contents");
        getWebDriver().switchTo().frame(findElementByCssSelector("#workspaceSupplementationEditorContainer #cke_workspaceSupplementationText .cke_contents .cke_wysiwyg_frame"));
        sendKeys(".cke_contents_ltr", "Test supplementation request.");
        getWebDriver().switchTo().defaultContent();
       
        waitAndClick("#workspaceSupplementationSave");
        waitForPresent(".notification-queue-item-success");

//      TODO: This circumvents the problem described below, but it wouldn't hurt to find a better way.
        navigate(String.format("/evaluation2"), false);
        waitAndClick(".evaluate-button");
        
        // TODO Never goes invisible, waitUntilAnimationIsDone("#workspaceSupplementationEditorContainer"); does not work either
        //waitForNotVisible("#workspaceSupplementationEditorContainer");
        
        waitForVisible(".eval-modal-workspace-event[data-type=\"SUPPLEMENTATION_REQUEST\"] .eval-modal-workspace-event-details");
        assertTextIgnoreCase(".eval-modal-workspace-event[data-type=\"SUPPLEMENTATION_REQUEST\"] .eval-modal-workspace-event-details", "Admin User pyysi täydennystä");
        
        // TODO Click goes to supplementation request CKEditor which should be hidden at this point
        waitAndClick(".eval-modal-workspace-event[data-type=\"SUPPLEMENTATION_REQUEST\"] .eval-modal-workspace-event-header .eval-modal-workspace-event-details");
        waitForVisible(".eval-modal-workspace-event[data-type=\"SUPPLEMENTATION_REQUEST\"] .eval-modal-workspace-event-content p");
        assertText(".eval-modal-workspace-event[data-type=\"SUPPLEMENTATION_REQUEST\"] .eval-modal-workspace-event-content p", "Test supplementation request.");

        logout();
        mockBuilder.mockLogin(student);
        login();
        selectFinnishLocale();
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Admin User");
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Työtila merkitty täydennettäväksi");
        
      
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }
  

  
}