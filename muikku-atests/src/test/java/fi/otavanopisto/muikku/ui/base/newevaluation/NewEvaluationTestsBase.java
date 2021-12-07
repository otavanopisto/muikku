package fi.otavanopisto.muikku.ui.base.newevaluation;

import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.putRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.github.tomakehurst.wiremock.matching.EqualToJsonPattern;

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
    OffsetDateTime dateNow = OffsetDateTime.of(LocalDateTime.now(), ZoneOffset.UTC);
    
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).build();
      Long courseId = 2l;
      Double price = new Double(75);
      
      login();
      
      Workspace workspace = createWorkspace("testcourses", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(courseId, workspace.getName(), created, "test course", begin, end);
      
      
      MockCourseStudent courseStudent = new MockCourseStudent(2l, courseId, student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 1l);
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
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, dateNow)
        .mockCompositeGradingScales()
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, dateNow)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), dateNow, false)
        .mockStaffCompositeCourseAssessmentRequests()
        .mockWorkspaceBasePrice(workspace.getIdentifier(), price)
        .mockWorkspaceBilledPriceUpdate(String.valueOf(price/2));
      
      logout();
      mockBuilder.mockLogin(admin);
      login();
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
      selectOption("#workspaceEvaluationBilling", "37.5");
      mockBuilder
      .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), dateNow, true)
      .mockStaffCompositeCourseAssessmentRequests()
      .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, dateNow);
    
      mockBuilder.mockCourseAssessments(courseStudent, admin).mockWorkspaceBilledPrice(String.valueOf(price/2));
      waitAndClick(".evaluation-modal__evaluate-drawer-row--buttons .button--evaluate-workspace");
      waitForPresent(".dialog--evaluation-archive-student.dialog--visible .button--standard-ok");
      waitAndClickAndConfirmVisibilityGoesAway(".button--standard-ok", ".dialog--evaluation-archive-student.dialog--visible", 3, 2000);
      assertText(".evaluation-modal__event .evaluation-modal__event-grade.state-PASSED", "Excellent");
      EqualToJsonPattern jsonPattern = new EqualToJsonPattern("{\"price\": 37.5}", true, true);
      verify(putRequestedFor(urlEqualTo("/1/worklist/billedPrice"))
          .withRequestBody(jsonPattern)
          .withHeader("Content-Type", equalTo("application/json")));
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
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 1l);
      mockBuilder
        .addCourseStaffMember(courseId, courseStaffMember)
        .addCourseStudent(courseId, courseStudent)
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
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date, false)
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
        String srcUrl = getAttributeValue(".evaluation-modal__item-body span.image img", "src");
        assertEquals(srcUrl, getAppUrl(false) + "/workspace/testcourse/materials/test-course-material-folder/test-exercise/5T0EHUR.gif");
        waitAndClick(".evaluation-modal__item-header .button-pill--evaluate");
        waitUntilAnimationIsDone(".evaluation-modal__evaluate-drawer");
        waitForPresent(".evaluation-modal__evaluate-drawer.state-OPEN");
        addTextToCKEditor("Test evaluation.");
        selectOption("#assignmentEvaluationGrade", "PYRAMUS-1");
        waitAndClick(".button--evaluate-assignment");
        
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
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 1l);
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
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date, false)
        .addStaffCompositeAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, admin.getId(), date.minusDays(2l), false)
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
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
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
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 1l);
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
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date, false)
        .addStaffCompositeAssessmentRequest(student2.getId(), courseId, courseStudent2.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student2, admin.getId(), date.minusDays(2l), false)
        .addStaffCompositeAssessmentRequest(student3.getId(), courseId, courseStudent3.getId(), "Tsadaam!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student3, admin.getId(), date.minusDays(1l), false)
        .mockStaffCompositeCourseAssessmentRequests();
        
        navigate(String.format("/evaluation"), false);
        
        waitForPresent(".evaluation-card:first-child .evaluation-card__header-title");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        
        waitAndClick(".evaluation-card:last-child .button-icon--important");
        waitUntilTextChanged(".evaluation-card:first-child .evaluation-card__header-title", "tester student");
        assertTextIgnoreCase(".evaluation-card:first-child .evaluation-card__header-title", "master apprentice");
        
        waitAndClick(".icon-sort-alpha-asc");
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
        .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
        .mockCompositeCourseAssessmentRequests()
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date, false)
        .mockStaffCompositeCourseAssessmentRequests();
        
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

        waitAndClick(".evaluation-modal__evaluate-drawer-row--buttons a.button--evaluate-supplementation");
        waitForNotVisible(".evaluation-modal__evaluate-drawer");
        waitForVisible(".evaluation-modal__header-title");
        assertTextIgnoreCase(".evaluation-modal__event:nth-child(2) .evaluation-modal__event-meta", "Admin User pyysi täydennystä");
        
        waitAndClick(".evaluation-modal__event:nth-child(2) .evaluation-modal__event-meta");
        waitUntilAnimationIsDone(".evaluation-modal__event:nth-child(2) .rah-static");
        assertText(".evaluation-modal__event:nth-child(2) .rah-static .evaluation-modal__event-literal-assessment p", "Test supplementation request.");

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
          archiveUserByEmail(student.getEmail());
        }
      } finally {
        mockBuilder.wiremockReset();
    }
  }

}