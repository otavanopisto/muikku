package fi.otavanopisto.muikku.ui.base.tor;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

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
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivity;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibility;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class ToRTestsBase extends AbstractUITest {

  @Test
  public void recordsWorkspaceEvaluationTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), null);
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 2l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .mockMatriculationEligibility(true)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      CourseActivity ca = new CourseActivity();
      ca.setCourseId(course1.getId());
      ca.setCourseName(course1.getName());
      ca.setGrade("Excellent");
      ca.setPassingGrade(true);
      ca.setGradeDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      ca.setText("Test evaluation.");
      ca.setActivityDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      ca.setState(CourseActivityState.GRADED);
      
      
      List<CourseActivity> courseActivities = new ArrayList<>();
      courseActivities.add(ca);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1.getId(), student.getId(), courseActivities);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 1l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
        mockBuilder
          .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, date)
          .mockCompositeGradingScales()
          .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, course1, student, date)
          .mockCompositeCourseAssessmentRequests()
          .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, true, course1, student, admin.getId(), date, true)
          .mockStaffCompositeCourseAssessmentRequests()
          .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello! I'd like to get assessment.", false, true, date)
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
        waitForPresent(".workspace-assessment__literal .workspace-assessment__literal-data");
        assertText(".workspace-assessment__literal .workspace-assessment__literal-data", "Test evaluation.");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    try{
      Long courseId = 1l;
      Course course1 = new CourseBuilder().name("testcourses").id(courseId).description("test course for testing").buildCourse();
      mockBuilder
        .addStudent(student)
        .mockMatriculationEligibility(true)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 1l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
        .build();
   
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test exercise", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
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
        waitForPresent(".material-page__textfield-wrapper.state-SAVED");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");
        
        mockBuilder
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, admin.getId(), date, false)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        navigate(String.format("/evaluation"), false);
        waitAndClick(".button-pill--evaluate");
        waitAndClick(".evaluation-modal__item-header-title--assignment");
        waitUntilAnimationIsDone(".rah-static");
        waitUntilHasText(".evaluation-modal__item-body span.material-page__textfield--evaluation");
        assertText(".evaluation-modal__item-body span.material-page__textfield--evaluation", "field value");
        waitAndClick(".evaluation-modal__item-header .button-pill--evaluate");
        waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
        waitForPresent(".evaluation-modal__evaluate-drawer.state-OPEN");
        addTextToCKEditor("Test evaluation.");
        selectOption("#assignmentEvaluationGrade", "PYRAMUS-1");
        waitAndClick(".button--evaluate-assignment");
        
        waitForVisible(".evaluation-modal__item-header.state-EVALUATED");
        waitForVisible(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED");
        assertTextIgnoreCase(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED", "Excellent");
        mockBuilder.addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, admin.getId(), date, true);
        logout();
        mockBuilder.mockLogin(student);
        login();
        
        navigate("/records#records", false);
        waitForPresent(".application-list__header-primary");
        waitAndClick(".application-list__header-primary");
        waitForPresent(".state-PASSED");
        assertText(".state-PASSED", "E");
        waitAndClick(".application-list__item-header--studies-assignment .application-list__header-primary");
        waitForVisible(".material-page__assignment-assessment-grade-data");
        assertText(".material-page__assignment-assessment-grade-data", "Excellent");
        waitForVisible(".material-page__assignment-assessment-literal .material-page__assignment-assessment-literal-data p");
        assertTextIgnoreCase(".material-page__assignment-assessment-literal .material-page__assignment-assessment-literal-data p", "Test evaluation.");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void recordsHOPSAndMatriculation() throws JsonProcessingException, Exception {
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    
    StudentMatriculationEligibility studentMatriculationEligibilityAI = new StudentMatriculationEligibility(true, 5, 4, 1);
    StudentMatriculationEligibility studentMatriculationEligibilityMAA = new StudentMatriculationEligibility(false, 8, 5, 1);
    try{
      mockBuilder
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(true)
        .mockMatriculationExam(true)
        .mockStudentsMatriculationEligibility(studentMatriculationEligibilityAI, "ÄI")
        .mockStudentsMatriculationEligibility(studentMatriculationEligibilityMAA, "MAA")
        .mockLogin(student)
        .build();
      login();
      selectFinnishLocale();
      navigate("/records#hops", false);
      waitAndClick(".form-element__radio-option-container #goalMatriculationExamyes");
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__select--matriculation-exam");
      selectOption(".form-element__select--matriculation-exam", "A");
      sleep(1000);
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__dropdown-selection-container:nth-child(2) .form-element__select--matriculation-exam");
      selectOption(".form-element__dropdown-selection-container:nth-child(2) .form-element__select--matriculation-exam", "M");
      sleep(1000);
      waitForPresentXPath("//a[@href='#yo']");
      clickLinkWithText("Ylioppilaskirjoitukset");
      
      waitForVisible(".application-sub-panel--yo-status-container");
      waitForVisible(".button--yo-signup");
      assertTextIgnoreCase(".button--yo-signup", "Ilmoittaudu YO-kokeeseen (12.12.2025 asti)");

      waitForVisible(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label", "Matematiikka, pitkä");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label + div.application-sub-panel__summary-item-description", "Osallistumisoikeuteen vaaditut kurssisuoritukset 6 / 8");

      waitForVisible(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label", "Äidinkieli");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label + div.application-sub-panel__summary-item-description", "Osallistumisoikeuteen vaaditut kurssisuoritukset 5 / 5");
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void recordsMatriculationExamNoSubjectsSelected() throws JsonProcessingException, Exception {
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    
    try{
      mockBuilder
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(true)
        .mockMatriculationExam(true)
        .mockLogin(student)
        .build();
      login();
      selectFinnishLocale();
      navigate("/records#hops", false);
      waitAndClick(".form-element__radio-option-container #goalMatriculationExamyes");
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__select--matriculation-exam");
      waitForPresentXPath("//a[@href='#yo']");
      clickLinkWithText("Ylioppilaskirjoitukset");
      
      waitForVisible(".application-sub-panel--yo-status-container");
      waitForVisible(".button--yo-signup");
      assertTextIgnoreCase(".button--yo-signup", "Ilmoittaudu YO-kokeeseen (12.12.2025 asti)");

      waitForVisible(".application-sub-panel__notification-body--studies-yo-subjects>div");
      assertTextIgnoreCase(".application-sub-panel__notification-body--studies-yo-subjects>div", "Et ole valinnut yhtään ainetta kirjoitettavaksesi. Valitse aineet HOPS-lomakkeelta.");
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void studiesSummaryTest() throws Exception {
    MockStudent student = new MockStudent(5l, 5l, "Studentos", "Tester", "studento@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111195-1252", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    
    try{
      mockBuilder
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(true)
        .mockLogin(student)
        .build();
        login();

        selectFinnishLocale();        
        navigate("/records", false);

        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title", "Opintojen alkamispäivä");        
        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-start-date");
        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-start-date span", "01.01.2012");
//  TODO: This.
//        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title");
//        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title", "Opinto-oikeuden päättymispäivä");
//        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-end-date");
//        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-end-date span", "10.11.2021");
        
        waitForPresent(".application-sub-panel__card-header--summary-evaluated");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-evaluated", "Kurssisuoritukset");
        waitForPresent(".application-sub-panel__card-highlight--summary-evaluated");
        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-evaluated", "0");
        
        waitForPresent(".application-sub-panel__card-header--summary-activity");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-activity", "Aktiivisuus");
        waitForPresent(".application-sub-panel__card-highlight--summary-activity");
        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-activity", "1");

        waitForPresent(".application-sub-panel__card-header--summary-returned");
        assertTextIgnoreCase(".application-sub-panel__card-header--summary-returned", "Palautetut tehtävät");
        waitForPresent(".application-sub-panel__card-highlight--summary-returned");
        assertTextIgnoreCase(".application-sub-panel__card-highlight--summary-returned", "0");
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
}