package fi.otavanopisto.muikku.ui.base.newevaluation;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.CeeposPaymentConfirmationRestModel;
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
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.StudentMatriculationEligibilityOPS2021;
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.rest.model.course.CourseAssessmentPrice;

public class NewEvaluationTestsBase extends AbstractUITest {
  
  @Test
  public void evaluateStudentWorkspaceTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 2).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();

      Double price = 0d;
      CourseAssessmentPrice courseBasePrice = new CourseAssessmentPrice(price);
      
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .mockEmptyStudyActivity()
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
      logout();
      
      mockBuilder
        .mockLogin(student)
        .mockCompositeGradingScales()
        .mockCourseAssessmentPrice(course1.getId(), courseBasePrice);
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
      waitAndClick(".link--workspace-assessment");
      waitForVisible(".dialog .dialog__content");

      sendKeys(".dialog__content-row .form-element__textarea", "Hello!");

      courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
      mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, dateNow)
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, dateNow, false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), dateNow, false)
        .mockStaffCompositeCourseAssessmentRequests()
        .mockWorkspaceBilledPriceUpdate(String.valueOf(price))
        .addCourseStudent(course1.getId(), courseStudent)
        .build();
            
      waitAndClick(".button--standard-ok");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      refresh();
      assertPresent(".icon-assessment-pending");
      
      logout();
      
      mockBuilder.mockLogin(admin).mockWorkspaceBilledPrice(String.valueOf(price));
      login();
      assertPresent(".navbar__item--communicator .indicator");
      navigate("/communicator", false);
      waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
      assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Student Tester (Test Study Programme)");
      waitAndClick("div.application-list__item.message");
      assertText(".application-list__item-content-body", "Student Tester (Test Study Programme) lähetti arviointipyynnön kurssilta testcourse (test extension).\n" + 
          "Arviointipyynnön teksti\n" + 
          "Hello!");

      navigate(String.format("/evaluation"), false);
      waitAndClick(".button-pill--evaluate");
      
      waitAndClickAndConfirm(".dialog--evaluation.dialog--visible a.button--evaluation-add-assessment", ".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace #workspaceEvaluationGrade", 10, 3000);
      
      waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
      if(getBrowser().equals("chrome_headless")) {
        sleep(500);
      }
      
      waitForPresent(".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace .cke_contents");
      addTextToCKEditor("Test evaluation.");
      
      selectOption("#workspaceEvaluationGrade", "PYRAMUS-1");
      mockBuilder
      .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, dateNow, true)
      .mockCompositeCourseAssessmentRequests()
      .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, true, false, course1, student, admin.getId(), dateNow, true)
      .mockStaffCompositeCourseAssessmentRequests()
      .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, true, false, dateNow);
      
      courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.GRADED_PASS));
      mockBuilder
        .mockCourseAssessments(course1, courseStudent, admin)
        .addCourseStudent(course1.getId(), courseStudent)
        .mockCourseActivities();
      
      waitAndClick(".form__buttons--evaluation .button--dialog-execute");
      waitForPresent(".dialog--evaluation-archive-student.dialog--visible .button--standard-ok");
      waitAndClickAndConfirmVisibilityGoesAway(".button--standard-ok", ".dialog--evaluation-archive-student.dialog--visible", 3, 2000);
      assertText(".evaluation-modal__event .evaluation-modal__event-grade.state-PASSED", "Excellent");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
        archiveUserByEmail(student.getEmail());
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
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
      
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .build();
   
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test exercise", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p><p><img alt=\"\" data-author=\"\" data-author-url=\"\" data-license=\"\" data-license-url=\"\" data-source=\"\" data-source-url=\"\" height=\"354\" src=\"5T0EHUR.gif\" width=\"500\" /></p>", 
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
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, date, false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), date, false)
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
        String srcUrl = getAttributeValue(".evaluation-modal__item-body span.image img", "src");
        assertEquals(srcUrl, getAppUrl(false) + "/workspace/testcourse/materials/test-course-material-folder/test-exercise/5T0EHUR.gif");
        waitAndClick(".evaluation-modal__item-header .button-pill--evaluate");
        waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
        waitForPresent(".evaluation-modal__evaluate-drawer.state-OPEN");
        addTextToCKEditor("Test evaluation.");
        selectOption("#assignmentEvaluationGrade", "PYRAMUS-1");
        waitAndClick(".button--dialog-execute");
        
        waitForVisible(".evaluation-modal__item-header.state-EVALUATED");
        waitForVisible(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED");
        assertTextIgnoreCase(".evaluation-modal .evaluation-modal__item .evaluation-modal__item-meta .evaluation-modal__item-meta-item-data--grade.state-EVALUATED", "Excellent");
        
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
          archiveUserByEmail(student.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

  @Test
  public void evaluationCardOrderingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Apprentice", "Master", "maprentice@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111109-1212", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStudent(student2).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
      
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
      MockCourseStudent courseStudent2 = new MockCourseStudent(3l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .addCourseStudent(course1.getId(), courseStudent2)
        .build();
      
      createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      try{
        mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, date)
        .mockAssessmentRequests(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, date, false)
        .addCompositeCourseAssessmentRequest(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, course1, student2, date.minusDays(2l), false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), date, false)
        .addStaffCompositeAssessmentRequest(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, course1, student2, admin.getId(), date.minusDays(2l), false)
        .mockStaffCompositeCourseAssessmentRequests();
        
        navigate(String.format("/evaluation"), false);
        
        waitAndClickAndConfirm(".button-pill--sorter .icon-sort-amount-asc", "a.button-pill--sorter-selected .icon-sort-amount-asc", 10, 500);
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        
        waitAndClickAndConfirm(".button-pill--sorter .icon-sort-amount-desc", "a.button-pill--sorter-selected .icon-sort-amount-desc", 10, 500);
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "tester student");

        waitAndClickAndConfirm(".button-pill--sorter .icon-sort-alpha-asc", "a.button-pill--sorter-selected .icon-sort-alpha-asc", 10, 500);
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        
        waitAndClickAndConfirm(".button-pill--sorter .icon-sort-alpha-desc", "a.button-pill--sorter-selected .icon-sort-alpha-desc", 10, 500);
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        } finally {
          deleteWorkspace(workspace.getId());
          archiveUserByEmail(student.getEmail());
          archiveUserByEmail(student2.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

  @Test
  public void evaluationRequestImportanceOrderingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Apprentice", "Master", "maprentice@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111109-1212", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student3 = new MockStudent(4l, 4l, "Anotha", "Student", "hurhurhrurh@example.com", 1l, OffsetDateTime.of(1992, 3, 1, 0, 0, 0, 0, ZoneOffset.UTC), "010392-2145", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStudent(student2).addStudent(student3).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
      
      login();
      
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent courseStudent2 = new MockCourseStudent(3l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent courseStudent3 = new MockCourseStudent(4l, course1, student3.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .addCourseStudent(course1.getId(), courseStudent2)
        .addCourseStudent(course1.getId(), courseStudent3)
        .build();
  
      createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      try{
        mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, date)
        .mockAssessmentRequests(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, date)
        .mockAssessmentRequests(student3.getId(), course1.getId(), courseStudent3.getId(), "Tsadaam!", false, false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, date, false)
        .addCompositeCourseAssessmentRequest(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, course1, student2, date.minusDays(2l), false)
        .addCompositeCourseAssessmentRequest(student3.getId(), course1.getId(), courseStudent3.getId(), "Tsadaam!", false, false, false, course1, student3, date.minusDays(1l), false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), date, false)
        .addStaffCompositeAssessmentRequest(student2.getId(), course1.getId(), courseStudent2.getId(), "Hello!", false, false, false, course1, student2, admin.getId(), date.minusDays(2l), false)
        .addStaffCompositeAssessmentRequest(student3.getId(), course1.getId(), courseStudent3.getId(), "Tsadaam!", false, false, false, course1, student3, admin.getId(), date.minusDays(1l), false)
        .mockStaffCompositeCourseAssessmentRequests();
        
        navigate(String.format("/evaluation"), false);
        
        waitForPresent(".evaluation-card:first-child .evaluation-card__header-title");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        
        waitAndClick(".evaluation-card:last-child .button-icon--important");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        
        waitAndClickAndConfirmTextChanges(".icon-sort-alpha-asc" , ".evaluation-card:last-child .evaluation-card__header-title", "tester student", 3, 1500);
        waitUntilTextChanged(".evaluation-card:last-child .evaluation-card__header-title", "student anotha");
        assertTextIgnoreCase(".evaluation-card:last-child .evaluation-card__header-title", "tester student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
      } finally {
          deleteWorkspace(workspace.getId());
          archiveUserByEmail(student.getEmail());
          archiveUserByEmail(student2.getEmail());
          archiveUserByEmail(student3.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
      }
    }

  @Test
  public void evaluationSupplemenetationRequestTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
      
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
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
        
        courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
        
        mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, date)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, date, false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), date, false)
        .mockStaffCompositeCourseAssessmentRequests()
        .addCourseStudent(course1.getId(), courseStudent)
        .mockCourseActivities();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();
        selectFinnishLocale();
        navigate(String.format("/evaluation"), false);
        waitAndClick(".button-pill--evaluate");
        
        waitAndClickAndConfirm(".dialog--evaluation.dialog--visible a.button--evaluation-add-supplementation", ".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace .cke_contents", 10, 5000);
        
        waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
        if(getBrowser().equals("chrome_headless")) {
          sleep(500);
        }

        waitForPresent(".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace .cke_contents");
        addTextToCKEditor("Test supplementation request.");

        waitAndClick(".form__buttons--evaluation a.button--dialog-execute");
        waitForNotVisible(".evaluation-modal__evaluate-drawer");
        waitForVisible(".evaluation-modal__header-title");
        assertTextIgnoreCase(".evaluation-modal__event.state-INCOMPLETE .evaluation-modal__event-meta", "Admin User pyysi täydennystä");
        
        waitAndClick(".evaluation-modal__event.state-INCOMPLETE .evaluation-modal__event-meta");
        waitUntilAnimationIsDone(".evaluation-modal__event.state-INCOMPLETE .rah-static");
        assertText(".evaluation-modal__event.state-INCOMPLETE .rah-static .evaluation-modal__event-literal-assessment p", "Test supplementation request.");

        logout();
        mockBuilder.mockLogin(student);
        login();
        selectFinnishLocale();
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Admin User");
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Kurssi merkitty täydennettäväksi");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
          archiveUserByEmail(student.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

  @Test
  public void journalAssignmentEvaluationTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.now(ZoneOffset.UTC);
    Builder mockBuilder = mocker();

    try{
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      
      login();

      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");

      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(),
          "Test", "text/html;editor=CKEditor",
          "<p><object type=\"application/vnd.muikku.field.journal\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-YxZ7XNIvcBgn2HDTl9qj2Wyb&quot;}\" />"
          + "<input name=\"muikku-field-YxZ7XNIvcBgn2HDTl9qj2Wyb\" type=\"file\" /></object></p>",
          "JOURNAL");
        try {
          String contentInput = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis mattis purus pharetra sagittis. Mauris eget ullamcorper leo. Donec et sollicitudin neque. Mauris in dapibus augue."
              + "Vestibulum porta nunc sed est efficitur, sodales dictum est rutrum. Suspendisse felis nisi, rhoncus sit amet tincidunt et, pellentesque ut purus. Vivamus id sem non neque gravida egestas. "
              + "Nulla consectetur quam mi.";
          logout();
          mockBuilder.mockLogin(student);
          login();
          
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".content-panel__chapter-title-text");
          addTextToCKEditor(".journalfield-wrapper", contentInput);
          waitForPresent(".material-page__field-answer-synchronizer--saved");
          waitAndClick(".button--muikku-submit-journal");
          waitForPresent(".journalfield-wrapper .journalfield__ckeditor-replacement--readonly p");
          
          mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
          
          mockBuilder
          .mockAssessmentRequests(student.getId(), course1.getId(), mockCourseStudent.getId(), "Hello!", false, false, false, date)
          .mockCompositeGradingScales()
          .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), mockCourseStudent.getId(), "Hello!", false, false, false, course1, student, date, false)
          .mockCompositeCourseAssessmentRequests()
          .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), mockCourseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), date, false)
          .mockStaffCompositeCourseAssessmentRequests()
          .addCourseStudent(course1.getId(), mockCourseStudent)
          .mockCourseActivities();
          
          logout();
          mocker().mockLogin(admin);
          login();
          selectFinnishLocale();
          navigate("/evaluation", false);
          waitAndClick(".button-pill--evaluate");

          waitAndClickAndConfirm(".evaluation-modal__item-actions--journal-feedback .link--evaluation", ".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace .cke_contents", 5, 2000);
          
          waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
          if(getBrowser().equals("chrome_headless")) {
            sleep(500);
          }
          
          String evaluationText = "Test evaluation for journal entry.";
          waitForPresent(".evaluation-modal__evaluate-drawer .evaluation-modal__evaluate-drawer-content--workspace .cke_contents");
          addTextToCKEditor(evaluationText);
          waitAndClick(".form__buttons--evaluation a.button--dialog-execute");
          waitForNotVisible(".evaluation-modal__evaluate-drawer");
          waitForVisible(".evaluation-modal__header-title");
          waitForVisible(".evaluation-modal__item-journal-feedback-data");
          
          assertText(".evaluation-modal__item-journal-feedback-data p", evaluationText);
          OffsetDateTime evaluationDate = OffsetDateTime.now(ZoneOffset.UTC);
          DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d.M.yyyy");
          String evaluationDateString = evaluationDate.format(formatter);
          assertTextIgnoreCase(".evaluation-modal__item-meta-item-data", evaluationDateString);
          
          logout();
          StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityAI = new StudentMatriculationEligibilityOPS2021(true, 10d, 8d);
          StudentMatriculationEligibilityOPS2021 studentMatriculationEligibilityMAA = new StudentMatriculationEligibilityOPS2021(false, 16d, 10d);
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
          navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), false);
          waitForVisible(".journal--feedback");
          assertTextIgnoreCase(".journal--feedback .journal__body", evaluationText);
          assertTextIgnoreCase(".journal--feedback .journal__meta-item:first-child .journal__meta-item-data", evaluationDateString);
          assertTextIgnoreCase(".journal--feedback .journal__meta-item:last-child .journal__meta-item-data", "Admin User");
          navigate("/records#records", false);
          waitAndClick(".button--assignments-and-exercises");
          waitForVisible(".dialog--studies");
          waitForVisible(".journal--feedback");
          assertTextIgnoreCase(".journal--feedback .journal__body", evaluationText);
          assertTextStartsWith(".journal--feedback .journal__meta-item:first-child .journal__meta-item-data", evaluationDateString);
          assertTextIgnoreCase(".journal--feedback .journal__meta-item:last-child .journal__meta-item-data", "Admin User");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
          archiveUserByEmail(student.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void evaluationPaymentTest() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    MockStudent student = new MockStudent(10l, 10l, "Rawring", "Reptile", "rawr@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "101010-1212", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    try {
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, true, false, null))
        .addStudentToStudentGroup(2l, student)
        .mockStudyProgrammes()
        .mockStudentGroups()
        .mockPersons()
        .mockStudents()
        .mockEmptyStudyActivity()
        .mockCompositeGradingScales()
        .build();
      Course course1 = new CourseBuilder().name("Pay me").id((long) 10).description("test course for testing evaluation payment").buildCourse();
      Double price = 150d;
      CourseAssessmentPrice cap = new CourseAssessmentPrice(price);
      mockBuilder
      .addCourse(course1)
      .mockCourseAssessmentPrice(course1.getId(), cap)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");      
      logout();
      MockCourseStudent mcs = new MockCourseStudent(10l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {      
        mockBuilder.mockLogin(student);
        login();

        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        selectFinnishLocale();
        waitForVisible(".content-panel__container .material-page--assignment input");
        assertValue(".content-panel__container .material-page--assignment input", "");
        waitAndClick(".content-panel__container .material-page--assignment input");
        waitAndSendKeys(".content-panel__container .material-page--assignment input", "field value");
        waitForPresent(".textfield-wrapper.state-SAVED");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");
        waitAndClick(".link--workspace-assessment");
        waitForVisible(".dialog .dialog__content");

        mcs = new MockCourseStudent(10l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
        
//      Order is created as entity clicks themselves to the store, so we need to anticipate the orderNo to be able to mock it in time.
        String orderNo = getNextCeeposOrderId();
        String refNo = "456";
        String cSalt = "xxxxxx";
        int ceeposStatus = 1;
        StringBuilder sb = new StringBuilder();
        sb.append(orderNo);
        sb.append("&");
        sb.append(ceeposStatus); // ceepos payment state
        sb.append("&");
        sb.append(refNo);
        sb.append("&");
        sb.append(cSalt);  // secret ceepos salt for hashing
        String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
        
        mockBuilder
          .mockAssessmentRequests(student.getId(), course1.getId(), mcs.getId(), "Hello!", false, false, false, dateNow)
          .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), mcs.getId(), "Hello!", false, false, false, course1, student, dateNow, false)
          .mockCompositeCourseAssessmentRequests()
          .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), mcs.getId(), "Hello!", false, false, false, course1, student, admin.getId(), dateNow, false)
          .mockStaffCompositeCourseAssessmentRequests()
          .mockWorkspaceBilledPriceUpdate(String.valueOf(cap.getPrice()))
          .addCourseStudent(course1.getId(), mcs)
          .mockCeeposRequestPayment(orderNo, refNo, cSalt, expectedHash, getAppUrl(), ceeposStatus)
          .build();     
        
        sendKeys(".dialog__content-row .form-element__textarea", "Hello!");
        waitAndClick(".button--standard-ok");
        
        assertText(".card__text-row--ceepos-feedback", "Tilauksen maksutapahtuma onnistui");
        assertText(".card__text-row .card__text-highlight--ceepos", "150 €");
        waitAndClick(".button--back-to-muikku");
        
        CeeposPaymentConfirmationRestModel cpcrm = new CeeposPaymentConfirmationRestModel(orderNo, ceeposStatus, refNo, expectedHash);

        int status = TestUtilities.sendHttpPOSTRequest(getAppUrl(false) + "/rest/ceepos/paymentConfirmation", objectMapper.writeValueAsString(cpcrm));
        if (status == 200) {
          assertPresent(".icon-assessment-pending");
          logout();
          
          mockBuilder.mockLogin(admin);
          login();
          
          assertPresent(".navbar__item--communicator .indicator");
          navigate("/communicator", false);
          waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
          assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Rawring Reptile (Aineopiskelu/yo-tutkinto)");
          waitAndClick("div.application-list__item.message");
          assertText(".application-list__item-content-body", "Rawring Reptile (Aineopiskelu/yo-tutkinto) lähetti arviointipyynnön kurssilta Pay me (test extension).\n" + 
              "Arviointipyynnön teksti\n" + 
              "Hello!");
        }else {
          assertTrue("paymentConfirmation status not 200", false);
        }
      }finally {
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void evaluationCancelledPaymentTest() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    Builder mockBuilder = mocker();
    MockStudent student = new MockStudent(11l, 11l, "Seething", "Salamander", "seethingsala@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111210-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    try {
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, true, false, null))
        .addStudentToStudentGroup(2l, student)
        .mockStudyProgrammes()
        .mockStudentGroups()
        .mockPersons()
        .mockStudents()
        .mockEmptyStudyActivity()
        .mockCompositeGradingScales()
        .build();
      Course course1 = new CourseBuilder().name("Pay me").id((long) 10).description("test course for testing evaluation payment").buildCourse();
      Double price = 150d;
      CourseAssessmentPrice cap = new CourseAssessmentPrice(price);
      mockBuilder
      .addCourse(course1)
      .mockCourseAssessmentPrice(course1.getId(), cap)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");      
      logout();
      MockCourseStudent mcs = new MockCourseStudent(11l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {      
        mockBuilder.mockLogin(student);
        login();

        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        selectFinnishLocale();
        waitForVisible(".content-panel__container .material-page--assignment input");
        assertValue(".content-panel__container .material-page--assignment input", "");
        waitAndClick(".content-panel__container .material-page--assignment input");
        waitAndSendKeys(".content-panel__container .material-page--assignment input", "field value");
        waitForPresent(".textfield-wrapper.state-SAVED");
        waitAndClick(".button--muikku-submit-assignment");

        waitForElementToBeClickable(".button--muikku-withdraw-assignment");
        waitAndClick(".link--workspace-assessment");
        waitForVisible(".dialog .dialog__content");

//      Order is created as entity clicks themselves to the store, so we need to anticipate the orderNo to be able to mock it in time.
        String orderNo = getNextCeeposOrderId();
        String refNo = "457";
        String cSalt = "xxxxxx";
        int ceeposStatus = 0;
        StringBuilder sb = new StringBuilder();
        sb.append(orderNo);
        sb.append("&");
        sb.append(ceeposStatus); // ceepos payment state
        sb.append("&");
        sb.append(refNo);
        sb.append("&");
        sb.append(cSalt);  // secret ceepos salt for hashing
        String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
        mockBuilder.mockCeeposRequestPayment(orderNo, refNo, cSalt, expectedHash, getAppUrl(), ceeposStatus);
        
        sendKeys(".dialog__content-row .form-element__textarea", "Hello!");
        waitAndClick(".button--standard-ok");
        
        assertText(".card__text-row--ceepos-feedback", "Keskeytit tilauksen maksutapahtuman. Ole hyvä ja ota yhteyttä ohjaajaasi.");
        assertText(".card__text-row .card__text-highlight--ceepos", "150 €");
        waitAndClick(".button--back-to-muikku");
        CeeposPaymentConfirmationRestModel cpcrm = new CeeposPaymentConfirmationRestModel(orderNo, 0, refNo, expectedHash);
        int status = TestUtilities.sendHttpPOSTRequest(getAppUrl(false) + "/rest/ceepos/paymentConfirmation", objectMapper.writeValueAsString(cpcrm));

        if (status == 200) {
          navigate("/profile#purchases", false);
          assertText(".application-list__item--product .application-list__header-primary-description", "Tilaus on peruttu.");
        }else {
          assertTrue("paymentConfirmation status not 200", false);
        }
        
      }finally {
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void cancelEvaluationRequestTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 2).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();

      Double price = 0d;
      CourseAssessmentPrice courseBasePrice = new CourseAssessmentPrice(price);
      
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .mockEmptyStudyActivity()
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
      logout();
      
      mockBuilder
        .mockLogin(student)
        .mockCompositeGradingScales()
        .mockCourseAssessmentPrice(course1.getId(), courseBasePrice);
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
      waitAndClick(".link--workspace-assessment");
      waitForVisible(".dialog .dialog__content");

      courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
      mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, dateNow)
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, dateNow, false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", false, false, false, course1, student, admin.getId(), dateNow, false)
        .mockStaffCompositeCourseAssessmentRequests()
        .mockWorkspaceBilledPriceUpdate(String.valueOf(price/2))
        .addCourseStudent(course1.getId(), courseStudent)
        .build();
      
      sendKeys(".dialog__content-row .form-element__textarea", "Hello!");
      
      waitAndClick(".button--standard-ok");
      assertPresent(".notification-queue__items .notification-queue__item--success");

      refresh();
      assertPresent(".icon-assessment-pending");
      
      waitAndClick(".link--workspace-assessment");

      waitForVisible(".dialog .dialog__content");
      courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder
        .addCourseStudent(course1.getId(), courseStudent)
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getId(), "Hello!", true, false, false, dateNow)
        .build();
      waitAndClick(".button--standard-ok");      
      assertPresent(".notification-queue__items .notification-queue__item--success");
      
      refresh();
      waitForPresent(".link--workspace-assessment");
      
      logout();
      
      mockBuilder.mockLogin(admin).mockWorkspaceBilledPrice(String.valueOf(price/2));
      login();
      assertPresent(".navbar__item--communicator .indicator");
      navigate("/communicator", false);
      waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
      assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Student Tester (Test Study Programme)");
      waitAndClick("div.application-list__item.message");
      assertText(".application-list__item--communicator-message:nth-child(2) .application-list__item-content-header", "Arviointipyyntö peruttu opiskelijalta Student Tester (Test Study Programme) kurssilla testcourse (test extension)");

      navigate(String.format("/evaluation"), false);
      waitAndClick(".button-pill--evaluate");
      
      assertPresent(".state-REQUESTED-CANCELLED");
      assertText(".evaluation-modal__event .evaluation-modal__event-meta", "Student Tester peruutti arviointipyynnön");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
        archiveUserByEmail(student.getEmail());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void evaluationLockRequestTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourse").id((long) 2).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStudent(student)
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();

      Double price = 0d;
      CourseAssessmentPrice courseBasePrice = new CourseAssessmentPrice(price);
      
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), courseStudent)
        .mockEmptyStudyActivity()
        .build();

      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
        "EVALUATED");
      
      try {
        logout();
        
        mockBuilder
          .mockLogin(student)
          .mockCompositeGradingScales()
          .mockCourseAssessmentPrice(course1.getId(), courseBasePrice);
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
        waitAndClick(".link--workspace-assessment");
        waitForVisible(".dialog .dialog__content");
  
        sendKeys(".dialog__content-row .form-element__textarea", "Hello!");
  
        courseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ASSESSMENT_REQUESTED_NO_GRADE));
        mockBuilder
        .addCourseStudent(course1.getId(), courseStudent)
        .build();
        
        mockBuilder
          .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, false, dateNow)
          .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, false, course1, student, dateNow, false)
          .mockCompositeCourseAssessmentRequests()
          .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, false, course1, student, admin.getId(), dateNow, false)
          .mockStaffCompositeCourseAssessmentRequests()
          .mockWorkspaceBilledPriceUpdate(String.valueOf(price))
          .build();
              
        waitAndClick(".button--standard-ok");
        assertPresent(".notification-queue__items .notification-queue__item--success");
        refresh();
        assertPresent(".icon-assessment-pending");
          
        logout();
        mockBuilder
          .mockLogin(admin)
          .mockAssessmentRequestLocking(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, true, dateNow);
        login();
        selectFinnishLocale();
        navigate(String.format("/evaluation"), false);
        waitAndClick(".button-pill--evaluate");
        
        sleep(500);
        waitForVisible(".button--evaluation-lock-request");
        waitAndClick(".button--evaluation-lock-request");
        assertPresent(".button--evaluation-unlock-request");
  
        mockBuilder
        .mockAssessmentRequests(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, true, dateNow)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, true, course1, student, dateNow, false)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), course1.getId(), courseStudent.getStudentId(), "Hello!", false, false, true, course1, student, admin.getId(), dateNow, false)
        .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(student);
        login();
        selectFinnishLocale();
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        assertPresent(".link--workspace-is-being-evaluated");
      } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
          deleteWorkspace(workspace.getId());
          archiveUserByEmail(student.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

}
