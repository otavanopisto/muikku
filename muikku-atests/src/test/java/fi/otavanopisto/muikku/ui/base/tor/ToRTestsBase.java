package fi.otavanopisto.muikku.ui.base.tor;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
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
import fi.otavanopisto.pyramus.rest.model.CourseActivityAssessment;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseActivitySubject;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StudentGroupUser;
import fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021;
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
        .mockMatriculationEligibility(student.getId(), true)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      CourseActivity ca = new CourseActivity();
      ca.setCourseId(course1.getId());
      CourseActivitySubject cas = new CourseActivitySubject();
      cas.setCourseModuleId(course1.getCourseModules().iterator().next().getId());
      cas.setSubjectName("Test subject");
      cas.setSubjectCode("tc_12");
      cas.setCourseLength((double) 3);
      cas.setCourseLengthSymbol("ov");
      ca.setSubjects(Arrays.asList(cas));
      String courseName = String.format("%s (%s)", course1.getName(), course1.getNameExtension());
      ca.setCourseName(courseName);
      CourseActivityAssessment caa = new CourseActivityAssessment();
      caa.setCourseModuleId(cas.getCourseModuleId());
      caa.setGrade("Excellent");
      caa.setPassingGrade(true);
      caa.setDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      caa.setGradeDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
      caa.setText("Test evaluation.");
      caa.setState(CourseActivityState.GRADED_PASS);
      ca.setAssessments(Arrays.asList(caa));
      
      List<CourseActivity> courseActivities = new ArrayList<>();
      courseActivities.add(ca);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), courseActivities);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
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
          .mockCourseAssessments(course1, courseStudent, admin)
          .mockStudentCourseStats(student.getId(), 10).build();
        
        logout();
        mockBuilder.mockLogin(student);
        login();
        
        navigate("/records#records", false);
        waitForPresent(".application-list__item-header--course .application-list__header-primary");
        assertText(".application-list__item-header--course .application-list__header-primary .application-list__header-primary-title", "testcourses (test extension)");
        assertText(".application-list__item-header--course .application-list__header-primary .application-list__header-primary-meta--records .label__text", "Nettilukio");
        
        waitForPresent(".application-list__item-header--course .application-list__indicator-badge--course");
        assertText(".application-list__item-header--course .application-list__indicator-badge--course", "E");
        
        waitAndClick(".application-list__item-header--course");
        waitForContent(".workspace-assessment__literal .workspace-assessment__literal-data", 5);
        assertText(".workspace-assessment__literal .workspace-assessment__literal-data", "Test evaluation.");
      } finally {
        archiveUserByEmail(student.getEmail());
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
        .mockMatriculationEligibility(student.getId(), true)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
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
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .textfield input", "");
        waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .textfield input");
        waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--assignment .textfield input", "field value");
        waitForPresent(".textfield-wrapper.state-SAVED");
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
        waitUntilHasText(".evaluation-modal__item-body span.textfield--evaluation");
        assertText(".evaluation-modal__item-body span.textfield--evaluation", "field value");
        waitAndClick(".evaluation-modal__item-header .button-pill--evaluate");
        waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
        waitForPresent(".evaluation-modal__evaluate-drawer.state-OPEN");
        addTextToCKEditor("Test evaluation.");
        selectOption("#assignmentEvaluationGrade", "PYRAMUS-1");
        waitAndClick(".button--dialog-execute");
        
        waitForVisible(".evaluation-modal__item-header.state-EVALUATED");
        waitForVisible(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED");
        assertTextIgnoreCase(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED", "Excellent");
        mockBuilder.addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, course1, student, admin.getId(), date, true);
        logout();
        mockBuilder.mockLogin(student);
        login();
        
        navigate("/records#records", false);
        waitForPresent(".application-list__header-secondary");
        waitAndClick(".application-list__header-secondary .button--assignments-and-exercises");
        waitUntilHasText(".dialog--studies .tabs__tab-data--assignments.active .application-list__indicator-badge.state-PASSED");
        assertText(".dialog--studies .tabs__tab-data--assignments.active .application-list__indicator-badge.state-PASSED", "E");
        waitAndClick(".dialog--studies .tabs__tab-data--assignments.active .application-list__item-header--studies-assignment");
        waitForVisible(".dialog--studies .tabs__tab-data--assignments.active .material-page__assignment-assessment-grade-data");
        assertText(".dialog--studies .tabs__tab-data--assignments.active .material-page__assignment-assessment-grade-data", "Excellent");
        waitForVisible(".dialog--studies .tabs__tab-data--assignments.active .material-page__assignment-assessment-literal .material-page__assignment-assessment-literal-data p");
        assertTextIgnoreCase(".dialog--studies .tabs__tab-data--assignments.active .material-page__assignment-assessment-literal .material-page__assignment-assessment-literal-data p", "Test evaluation.");
      } finally {
          archiveUserByEmail(student.getEmail());
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
    
    StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityAI = new StudentMatriculationEligibilityOPS2021(true, 10d, 8d);
    StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityMAA = new StudentMatriculationEligibilityOPS2021(false, 16d, 10d);
    try{
      mockBuilder
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(student.getId(), true)
        .mockMatriculationExam(true)
        .mockStudentsMatriculationEligibility(studentMatriculationEligibilityAI, "ÄI")
        .mockStudentsMatriculationEligibility(studentMatriculationEligibilityMAA, "MAA")
        .mockLogin(student)
        .build();
      login();
      selectFinnishLocale();
      navigate("/records#hops", false);
      waitAndClick(".form-element--checkbox-radiobutton #goalMatriculationExamyes");
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__select--matriculation-exam");
      selectOption(".form-element__select--matriculation-exam", "A");
      sleep(1000);
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__dropdown-selection-container:nth-child(2) .form-element__select--matriculation-exam");
      selectOption(".form-element__dropdown-selection-container:nth-child(2) .form-element__select--matriculation-exam", "M");
      sleep(1000);
      waitAndClick(".tabs--application-panel .tabs__tab--yo");
      
      waitForVisible(".tabs__tab-data--yo");
      waitForVisible(".button--yo-signup");
      assertTextIgnoreCase(".button--yo-signup", "Ilmoittaudu YO-kirjoituksiin (12.12.2025 asti)");

      waitForVisible(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label", "Matematiikka, pitkä");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--not-eligible + div.application-sub-panel__summary-item-label + div.application-sub-panel__summary-item-description", "Osallistumisoikeuteen vaaditut kurssisuoritukset 6 / 8");

      waitForVisible(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label", "Äidinkieli");
      assertTextIgnoreCase(".application-sub-panel__summary-item-state--eligible + div.application-sub-panel__summary-item-label + div.application-sub-panel__summary-item-description", "Osallistumisoikeuteen vaaditut kurssisuoritukset 5 / 5");
    }finally {
      archiveUserByEmail(student.getEmail());
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
        .mockMatriculationEligibility(student.getId(), true)
        .mockMatriculationExam(true)
        .mockLogin(student)
        .build();
      login();
      selectFinnishLocale();
      navigate("/records#hops", false);
      waitAndClick(".form-element--checkbox-radiobutton #goalMatriculationExamyes");
      waitAndClick(".button--add-subject-row");
      waitForVisible(".form-element__select--matriculation-exam");
      waitAndClick(".tabs--application-panel .tabs__tab--yo");
      
      waitForVisible(".tabs__tab-data--yo");
      waitForVisible(".button--yo-signup");
      assertTextIgnoreCase(".button--yo-signup", "Ilmoittaudu YO-kirjoituksiin (12.12.2025 asti)");

      waitForVisible(".application-sub-panel__notification-body--studies-yo-subjects>div");
      assertTextIgnoreCase(".application-sub-panel__notification-body--studies-yo-subjects>div", "Et ole valinnut yhtään kirjoitettavaa ainetta. Valitse aineet HOPS-lomakkeelta.");
    }finally {
      archiveUserByEmail(student.getEmail());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void studiesSummaryTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(5l, 5l, "Studentos", "Tester", "studento@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111195-1252", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    student.addCounselor(new StudentGroupUser(1l, 1l));
    Builder mockBuilder = mocker();
    
    try{
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(student.getId(), true)
        .mockLogin(student)
        .build();
        login();
      selectFinnishLocale();        
      navigate("/records", false);
      
      waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title");
      assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title", "Opintojen alkamispäivä");
      waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-start-date");
      assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-start-date span", "1.1.2012");
//  TODO: This.
//        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title");
//        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(2) .application-sub-panel__item-title", "Opinto-oikeuden päättymispäivä");
//        waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-end-date");
//        assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item-data--study-end-date span", "10.11.2021");
      assertTextIgnoreCase(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(3) .application-sub-panel__item-title", "Opinto-ohjaaja");        
      findElementOrReloadAndFind(".item-list--student-counselors .item-list__user-name", 5, 5000);
      assertTextIgnoreCase(".item-list--student-counselors .item-list__user-name", "Admin User");
      assertTextIgnoreCase(".item-list--student-counselors .item-list__user-email", "admin@example.com");
      assertPresent(".item-list--student-counselors .button-pill--new-message");
      
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
      archiveUserByEmail(student.getEmail());
      deleteUserGroupUsers();
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void taskTest() throws Exception {
    MockStudent student = new MockStudent(2l, 2l, "Studentos", "Tester", "studento@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111195-1252", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    
    try{
      mockBuilder
        .addStudent(student)
        .mockStudentCourseStats(student.getId(), 25)
        .mockMatriculationEligibility(student.getId(), true)
        .mockEmptyStudyActivity()
        .mockLogin(student)
        .build();
        login();
      mockBuilder.addStudentToStudentGroup(2l, student).mockPersons().mockStudents().mockStudyProgrammes().mockStudentGroups();
      selectEnglishLocale();
      navigate("/records", false);
      
      waitForPresent(".application-sub-panel__body--studies-summary-info .application-sub-panel__item:nth-child(1) .application-sub-panel__item-title");
      waitAndClick(".button-pill--add-note span");
      
      sendKeys(".env-dialog__input", "Task for myself.");
      addTextToCKEditor("Do some stuff!");
      waitAndClick(".button--dialog-execute");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      
      assertText(".notes .notes__item .notes__item-header span", "Task for myself.");
      assertText(".notes .notes__item .notes__item-body p", "Do some stuff!");
//    "more actions" vertical menu
      waitAndClick(".notes .notes__item .icon-more_vert");
//    Mark as done link
      waitAndClick(".dropdown__container-item");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      assertText(".notes .notes__item .notes__item-status.notes__item-status--done", "Done");
      
      waitAndClick(".notes .notes__item .icon-trash");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      waitAndClick(".tabs--notes #tabControl-archived");
      assertText("#tabPanel-archived .notes .notes__item .notes__item-header span", "Task for myself.");
      assertText("#tabPanel-archived .notes .notes__item .notes__item-body p", "Do some stuff!");
    } finally {
      archiveUserByEmail(student.getEmail());
      deleteUserGroupUsers();
      mockBuilder.wiremockReset();
    }
  }
  
}