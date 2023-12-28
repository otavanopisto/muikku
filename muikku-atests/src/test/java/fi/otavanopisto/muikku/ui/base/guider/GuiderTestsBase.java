package fi.otavanopisto.muikku.ui.base.guider;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

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
import fi.otavanopisto.muikku.mock.model.MockCourse;
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
import fi.otavanopisto.pyramus.rest.model.StudyProgramme;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class GuiderTestsBase extends AbstractUITest {
  
  private static final long DEFAULT_ORGANIZATION_ID = 1L;
  
  @Test
  public void filterByNameTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststuqfwertdent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Test", "Student", "teststrewtretudentos@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("testcourse").id((long) 2).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 3).description("Second test course").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .addCourse(course2)
      .build();
    login();
 
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs2 = new MockCourseStudent(3l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addStudent(student)
      .addStudent(student2)
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStudent(workspace.getId(), mcs2)
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();

    try {
      navigate("/guider", false);
      waitAndClick(".application-panel__toolbar .form-element--search input.form-element__input--search");
      sendKeys(".application-panel__toolbar .form-element--search input.form-element__input--search", "Second User");
      waitUntilElementCount(".application-list .user--guider", 1);
      waitForPresent(".application-list__item-header .application-list__header-primary span");
      assertTextIgnoreCase(".application-list__item-header .application-list__header-primary span", "Second User");
      assertTextIgnoreCase(".application-list .application-list__item-header .application-list__header-helper", "te...@example.com");
      assertTextIgnoreCase(".application-list .application-list__item-header .application-list__header-secondary", "Test Study Programme");
    } finally {
      archiveUserByEmail(student.getEmail());
      archiveUserByEmail(student2.getEmail());
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void filterByWorkspaceTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(4l, 4l, "Second", "User", "testuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(5l, 5l, "Test", "Student", "testtudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111210-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Testaa").id((long) 4).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(4l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
    try {
      navigate("/guider", false);
      waitAndClick(".application-panel__content-aside a.menu__item-link");
      waitUntilAnimationIsDone(".application-panel__content-main");
      clickAndConfirmElementCount(".application-panel__content-aside a.menu__item-link", ".application-list .user--guider", 1);
      waitUntilElementCount(".application-list .user--guider", 1);
      waitForPresent(".application-list__item-header .application-list__header-primary span");
      assertTextIgnoreCase(".application-list__item-header .application-list__header-primary span", "Second User");
      assertCount(".application-list__item-header .application-list__header-primary", 1);
    }finally {
      archiveUserByEmail(student.getEmail());
      archiveUserByEmail(student2.getEmail());
      deleteWorkspace(workspace1.getId());      
    }
  } finally {
    mockBuilder.wiremockReset();
  }
  }
  
  @Test
  public void uploadFileToStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(6l, 6l, "Second", "User", "teststueradsfdent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("testcourse").id((long) 5).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .mockLogin(admin)
    .addCourse(course1)
    .mockStudentCourseStats(student.getId(), 25)
    .mockMatriculationEligibility(false)
    .build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(6l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, 1l, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);

    mockBuilder
      .addCourseStaffMember(workspace.getId(), courseStaffMember)
      .addCourseStudent(workspace.getId(), mcs)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick(".application-list__header-primary>span");
      waitAndClick("#tabControl-STUDY_HISTORY");
      waitAndClick("#studyLibrary");      
      waitForPresent(".file-uploader input");
      scrollIntoView(".file-uploader input");

      File testFile = getTestFile();
      sendKeys(".file-uploader input", testFile.getAbsolutePath());
      waitForPresent(".file-uploader__items-container .file-uploader__item-title");
      assertTextStartsWith(".file-uploader__items-container .file-uploader__item-title", testFile.getName());
      logout();
      mockBuilder.mockLogin(student);
      login();
      navigate("/records", false);
      
      waitAndClick(".tabs--application-panel .tabs__tab--records");
      
      waitForVisible(".tabs__tab-data--records");
      
      waitForPresent("a.link--studies-file-attachment");
      assertText("a.link--studies-file-attachment", "img_100x100_3x8bit_RGB_circles_center_0016.png");
    } finally {
      archiveUserByEmail(student.getEmail());
      deleteWorkspace(workspace.getId());
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
  public void gradeShownInGuiderTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(7l, 7l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    OffsetDateTime date = OffsetDateTime.of(2016, 11, 10, 1, 1, 1, 1, ZoneOffset.UTC);
    Course course1 = new CourseBuilder().name("testcourses").id((long) 6).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStudent(student).addStaffMember(admin).mockLogin(admin).addCourse(course1).build();
      Long courseId = 6l;    
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      OffsetDateTime created = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime begin = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime end = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime signupStart = OffsetDateTime.of(2015, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      OffsetDateTime signupEnd = OffsetDateTime.of(2045, 10, 12, 12, 12, 0, 0, ZoneOffset.UTC);
      MockCourse mockCourse = new MockCourse(workspace.getId(), workspace.getName(), created, "test course", begin, end, signupStart, signupEnd);
      
      MockCourseStudent courseStudent = new MockCourseStudent(7l, course1, student.getId(), new ArrayList<>());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
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
        waitForVisible(".material-page__field-answer-synchronizer--saved");
        waitAndClick(".button--muikku-submit-assignment");

        CourseActivity ca = new CourseActivity();
        ca.setCourseId(course1.getId());
        CourseActivitySubject cas = new CourseActivitySubject();
        cas.setCourseModuleId(course1.getCourseModules().iterator().next().getId());
        ca.setSubjects(Arrays.asList(cas));
        ca.setCourseName(course1.getName());
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
        
        courseStudent = new MockCourseStudent(7l, course1, student.getId(), courseActivities);
        
        mockBuilder
        .addCourseStudent(courseId, courseStudent)
        .build();
        
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
        
        mockBuilder
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date, true)
        .mockStaffCompositeCourseAssessmentRequests()
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, date);
      
        // First test the course listing in the "situation"-tab
        mockBuilder.mockCourseAssessments(course1, courseStudent, admin);          
        navigate("/guider", false);
        waitAndClick(".application-list__header-primary>span");
        waitForPresent(".application-list__header-secondary .application-list__indicator-badge");
        assertText(".application-list__header-secondary .application-list__indicator-badge", "E");
        // Then archive the student from the workspace
        navigate(String.format("/workspace/%s/users", workspace.getUrlName()), false);
        waitAndClick(".application-list--workspace-users .application-list__item-content-actions .icon-trash");
        waitForVisible(".button--standard-ok");
        waitUntilAnimationIsDone(".dialog--deactivate-reactivate-user");
        sleep(1000);
        waitAndClickAndConfirmVisibilityGoesAway(".button--standard-ok", ".dialog--deactivate-reactivate-user", 3, 2000);
        waitForPresent(".application-list__item-content-main--workspace-user .application-list__item-content-primary-data>span");
        assertText(".application-list__item-content-main--workspace-user .application-list__item-content-primary-data>span", "Student Tester");
        // Then test the history - tab
        navigate("/guider", false);
        waitAndClick(".application-list__header-primary>span");
        waitAndClick("#tabControl-STUDY_HISTORY");      
        waitForPresent(".application-list__header-secondary .application-list__indicator-badge");
        assertText(".application-list__header-secondary .application-list__indicator-badge", "E");
        
      }finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    }finally {
      archiveUserByEmail(student.getEmail());
      mockBuilder.wiremockReset();  
    }
  }

  @Test
  public void studentsWorkspacesInAlphabeticalOrderTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(8l, 8l, "Second", "User", "tesrdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("agz").id((long) 7).description("test course for testing").buildCourse();
      Course course2 = new CourseBuilder().name("aa").id((long) 8).description("wiener course for testing").buildCourse();
      Course course3 = new CourseBuilder().name("baz").id((long) 9).description("potato course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .addCourse(course2)
      .addCourse(course3)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
      Workspace workspace3 = createWorkspace(course3, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(8l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      MockCourseStudent mcs2 = new MockCourseStudent(9l, course2, student.getId(), TestUtilities.createCourseActivity(course2, CourseActivityState.ONGOING));
      MockCourseStudent mcs3 = new MockCourseStudent(10l, course3, student.getId(), TestUtilities.createCourseActivity(course3, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      CourseStaffMember courseStaffMember2 = new CourseStaffMember(2l, course2.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      CourseStaffMember courseStaffMember3 = new CourseStaffMember(3l, course3.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStudent(course2.getId(), mcs2)
        .addCourseStudent(course3.getId(), mcs3)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStaffMember(course2.getId(), courseStaffMember2)
        .addCourseStaffMember(course3.getId(), courseStaffMember3)
        .build();
      try {
        navigate("/guider", false);
        waitAndClick(".application-list__item-content-main .application-list__header-primary");
        waitForPresent(".application-list__item-header--course .application-list__header-primary");
        List<WebElement> webElements = getWebDriver().findElements(By.cssSelector(".application-list__item-header--course .application-list__header-primary"));
        while(webElements.remove(null));
        assertTrue(isInOrder(webElements));
      }finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace3.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void studentStudiesEndDateWarningTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(9l, 9l, "Arctic", "Fox", "arcticfox@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("aasdgz").id((long) 10).description("test coursemus for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(11l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        selectFinnishLocale();
        navigate("/guider", false);
        waitForPresent(".application-list__item-footer--student .label--ENDING");
        assertTextStartsWith(".application-list__item-footer--student .label--ENDING span.label__text", "Opintoaika päättymässä");
        student = new MockStudent(9l, 9l, "Arctic", "Fox", "arcticfox@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
        mockBuilder.updateStudent(student).build();
        navigate("", false);
        navigate("/guider", false);
        assertNotPresent(".application-list__item-footer--student .label--ENDING");
      }finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void sendMessageFromGuider() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(10l, 10l, "Southern", "Otter", "southo@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121211-1211", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test kurs").id((long) 11).description("test kursimus for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(10l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        selectFinnishLocale();
        navigate("/guider", false);
        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        waitAndClick(".button-pill--new-message:not(.disabled)");
        sendKeys("#messageTitle", "Message from guider.");
        addTextToCKEditor("Hello from guider!");
        waitAndClick(".button--dialog-execute");
        assertPresent(".notification-queue__items .notification-queue__item--success");
      }finally {
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void addStudyTimeTest() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    MockStudent student = new MockStudent(10l, 10l, "Eastern", "Ibex", "ibexofeast@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "101010-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    try {
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, false, false, null))
        .addStudentToStudentGroup(2l, student)
        .mockPersons()
        .mockStudents()
        .mockStudyProgrammes()
        .mockStudentGroups()
        .mockEmptyStudyActivity()
        .build();
      Course course1 = new CourseBuilder().name("aasdgz").id((long) 10).description("test coursemus for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(12l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        selectFinnishLocale();
        navigate("/guider", false);
        waitForPresent(".application-list__item-footer--student .label--ENDING");
        waitAndClick(".application-list__header-primary>span");
        waitAndClickAndConfirm(".button-pill--create-student-order", ".dropdown .link--purchasable-product-dropdown", 5, 500);
        waitAndClickAndConfirm(".dropdown__container-item:first-child .link--purchasable-product-dropdown", ".dialog--dialog-confirm-order.dialog--visible", 5, 1000);
        waitAndClick(".button--standard-ok");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-title", "Nettilukion opiskelumaksu 6 kk");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-description", "opiskelijalle on luotu tilaus.");
        assertPresent(".application-list__header-primary--product .application-list__header-primary-actions .button--delete-student-order");
        logout();

        String orderNo = getLatestCeeposOrderId();
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
        mockBuilder.mockLogin(student).mockCeeposRequestPayment(orderNo, refNo, cSalt, expectedHash, getAppUrl(), ceeposStatus);
        
        login();
        selectFinnishLocale();
        navigate("/profile#purchases", false);
        assertTextIgnoreCase(".application-list__item--product .application-list__header-primary-title", "Nettilukion opiskelumaksu 6 kk");
        assertTextIgnoreCase(".application-list__header-primary-description", "Tilauksesi on luotu.");
        assertPresent(".application-list__header-primary-actions .button--pay-student-order");
        click(".application-list__header-primary-actions .button--pay-student-order");
        waitForPresent(".card__text-row--ceepos-feedback");
        assertTextIgnoreCase(".card__text-row--ceepos-feedback", "Tilauksen maksutapahtuma onnistui");
        assertTextIgnoreCase(".button--back-to-muikku", "Muikun etusivulle");
        click(".button--back-to-muikku");
        
        int monthsToIncrease = 6;
        student = new MockStudent(10l, 10l, "Eastern", "Ibex", "ibexofeast@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "101010-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.addMonths(monthsToIncrease));
        mockBuilder.mockStudyTimeIncrease(student, monthsToIncrease);

        CeeposPaymentConfirmationRestModel cpcrm = new CeeposPaymentConfirmationRestModel(orderNo, ceeposStatus, refNo, expectedHash);
        
        int status = TestUtilities.sendHttpPOSTRequest(getAppUrl(false) + "/rest/ceepos/paymentConfirmation", objectMapper.writeValueAsString(cpcrm));
        if (status == 200) {
          mockBuilder.build();
          assertVisible(".navbar .button-pill--profile");
          navigate("/profile#general", false);
          assertText(".application-sub-panel__item-data--study-end-date span:first-child", TestUtilities.addMonths(monthsToIncrease).format(DateTimeFormatter.ofPattern("d.M.yyyy")));
          navigate("/profile#purchases", false);
          assertTextIgnoreCase(".application-list__item--product .application-list__header-primary-description", "Tilauksesi on maksettu ja käsitelty.");
        }else {
          assertTrue("paymentConfirmation status not 200", false);
        }
      }finally {
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void deleteAdditionalStudyTimeOrderTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    MockStudent student = new MockStudent(11l, 11l, "Midwest", "Mudweller", "mmud@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "101000-1011", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    try {
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, false, false, null))
      .addStudentToStudentGroup(2l, student)
      .mockPersons()
      .mockStudents()
      .mockStudyProgrammes()
      .mockStudentGroups()
      .mockEmptyStudyActivity()
      .build();
      Course course1 = new CourseBuilder().name("aasdgz").id((long) 12).description("test coursemus for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(13l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        selectFinnishLocale();
        navigate("/guider", false);
        waitForPresent(".application-list__item-footer--student .label--ENDING");
        waitAndClick(".application-list__header-primary>span");
        waitAndClickAndConfirm(".button-pill--create-student-order", ".dropdown .link--purchasable-product-dropdown", 5, 500);
        waitAndClickAndConfirm(".dropdown__container-item:first-child .link--purchasable-product-dropdown", ".dialog--dialog-confirm-order.dialog--visible", 5, 1000);
        waitAndClick(".button--standard-ok");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-title", "Nettilukion opiskelumaksu 6 kk");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-description", "opiskelijalle on luotu tilaus.");
        assertPresent(".application-list__header-primary--product .application-list__header-primary-actions .button--delete-student-order");
        waitAndClick(".application-list__header-primary--product .application-list__header-primary-actions .button--delete-student-order");
        waitAndClick(".dialog--dialog-delete-order.dialog--visible .button--fatal");
        waitUntilElementGoesAway(".application-list__header-primary--product .application-list__header-primary-actions .button--delete-student-order", (long) 10);
        assertPresent(".icon-cart-plus");
      }finally {
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void cancelStudyTimeTest() throws Exception {
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    MockStudent student = new MockStudent(12l, 12l, "Southeastern", "Stinger", "sting@example.com", 2l, OffsetDateTime.of(1991, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121091-1211", Sex.MALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextWeek());
    try {
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, false, false, null))
        .addStudentToStudentGroup(2l, student)
        .mockPersons()
        .mockStudents()
        .mockStudyProgrammes()
        .mockStudentGroups()
        .mockEmptyStudyActivity()
        .build();
      Course course1 = new CourseBuilder().name("Tests").id((long) 13).description("test coursemus for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(14l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
      mockBuilder
        .addCourseStudent(course1.getId(), mcs)
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        selectFinnishLocale();
        navigate("/guider", false);
        waitForPresent(".application-list__item-footer--student .label--ENDING");
        waitAndClick(".application-list__header-primary>span");
        waitAndClickAndConfirm(".button-pill--create-student-order", ".dropdown .link--purchasable-product-dropdown", 5, 500);
        waitAndClickAndConfirm(".dropdown__container-item:first-child .link--purchasable-product-dropdown", ".dialog--dialog-confirm-order.dialog--visible", 5, 1000);
        waitAndClick(".button--standard-ok");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-title", "Nettilukion opiskelumaksu 6 kk");
        assertTextIgnoreCase(".application-list__header-primary--product .application-list__header-primary-description", "opiskelijalle on luotu tilaus.");
        assertPresent(".application-list__header-primary--product .application-list__header-primary-actions .button--delete-student-order");
        logout();
        String orderNo = getLatestCeeposOrderId();
        String refNo = "456";
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
        mockBuilder.mockLogin(student).mockCeeposRequestPayment(orderNo, refNo, cSalt, expectedHash, getAppUrl(), ceeposStatus);
        login();
        selectFinnishLocale();
        navigate("/profile#purchases", false);
        assertTextIgnoreCase(".application-list__item--product .application-list__header-primary-title", "Nettilukion opiskelumaksu 6 kk");
        assertTextIgnoreCase(".application-list__header-primary-description", "Tilauksesi on luotu.");
        assertPresent(".application-list__header-primary-actions .button--pay-student-order");
        click(".application-list__header-primary-actions .button--pay-student-order");
        waitForPresent(".card__text-row--ceepos-feedback");
        assertTextIgnoreCase(".card__text-row--ceepos-feedback", "Keskeytit tilauksen maksutapahtuman. Ole hyvä ja ota yhteyttä ohjaajaasi.");
        assertTextIgnoreCase(".button--back-to-muikku", "Muikun etusivulle");
        click(".button--back-to-muikku");
        
        CeeposPaymentConfirmationRestModel cpcrm = new CeeposPaymentConfirmationRestModel(orderNo, ceeposStatus, refNo, expectedHash);
        
        int status = TestUtilities.sendHttpPOSTRequest(getAppUrl(false) + "/rest/ceepos/paymentConfirmation", objectMapper.writeValueAsString(cpcrm));
        if (status == 200) {
          mockBuilder.build();
          assertVisible(".navbar .button-pill--profile");
          navigate("/profile#general", false);
          assertText(".application-sub-panel__item-data--study-end-date span:first-child", TestUtilities.getNextWeek().format(DateTimeFormatter.ofPattern("d.M.yyyy")));
          navigate("/profile#purchases", false);
          assertTextIgnoreCase(".application-list__item--product .application-list__header-primary-description", "Tilaus on peruttu.");
          logout();
          mockBuilder.mockLogin(admin);
          login();
          selectFinnishLocale();
          navigate("/guider", false);
          waitForPresent(".application-list__item-footer--student .label--ENDING");
          waitAndClick(".application-list__header-primary>span");
          scrollTo(".button-pill--create-student-order", 150);
          assertTextIgnoreCase(".application-list__item--product .application-list__header-primary--product .application-list__header-primary-description", "Opiskelija peruutti tilauksen.");
        }else {
          assertTrue("paymentConfirmation status not 200", false);
        }
      }finally {
        deleteUserGroupUsers();
        archiveUserByEmail(student.getEmail());
        deleteWorkspace(workspace1.getId());      
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void filterByStudyProgrammeTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStaffMember manager = new MockStaffMember(13l, 13l, DEFAULT_ORGANIZATION_ID, "Manager", "Person", UserRole.MANAGER, "090975-1231", "testmanager@example.com", Sex.MALE);
    Set<Long> staffStudyProgrammes = new HashSet<>();
    staffStudyProgrammes.add(1l);
    manager.setStaffStudyProgrammes(staffStudyProgrammes);
    MockStaffMember spl = new MockStaffMember(16l, 16l, DEFAULT_ORGANIZATION_ID, "Leader", "Person", UserRole.STUDY_PROGRAMME_LEADER, "080975-1238", "testleader@example.com", Sex.MALE);
    staffStudyProgrammes = new HashSet<>();
    staffStudyProgrammes.add(3l);
    spl.setStaffStudyProgrammes(staffStudyProgrammes);    
    MockStudent student = new MockStudent(14l, 14l, "SecondS", "User", "testuersas@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "111012-1412", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(15l, 15l, "TestS", "Student", "testtua@example.com", 2l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "011210-1312", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder
        .addStudyProgramme(new StudyProgramme(2l, 1l, "test_lukio", "Aineopiskelu/yo-tutkinto", 1l, null, false, false, null))
        .addStudyProgramme(new StudyProgramme(3l, 1l, "test_sprogramme", "Nettikoulu/yo", 1l, null, false, false, null))
        .addStaffMember(admin)
        .addStaffMember(manager)
        .addStaffMember(spl)
        .addStudent(student)
        .addStudent(student2)
        .mockLogin(manager)
        .build();
      login();
      try {
        navigate("/guider", false);
        waitForPresent(".application-list__item-header .application-list__header-primary span");
        assertTextIgnoreCase(".application-list__item-header .application-list__header-primary span", "SecondS User");
        assertCount(".application-list__item-header .application-list__header-primary", 1);
        logout();
        mockBuilder.mockLogin(admin);
        login();
        navigate("/guider", false);
        waitForPresent(".application-list__item-header .application-list__header-primary span");
        assertCount(".application-list__item-header .application-list__header-primary", 2);
        logout();
        mockBuilder.mockLogin(spl);
        login();
        navigate("/guider", false);
        assertPresent(".empty");
      }finally {
        archiveUserByEmail(manager.getEmail());
        archiveUserByEmail(spl.getEmail());
        archiveUserByEmail(student.getEmail());
        archiveUserByEmail(student2.getEmail());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void taskingFromGuiderTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, DEFAULT_ORGANIZATION_ID, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(17l, 17l, "Lion", "Lucid", "lion@example.com", 1l, OffsetDateTime.of(1993, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "020293-2983", Sex.FEMALE, TestUtilities.toDate(2020, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("testcourse").id((long) 5).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder
    .addStudentGroup(2l, 1l, "Admins guidance", "Admins guidance group for users", 1l, false, true)
    .addStaffMember(admin)
    .addStudent(student)
    .mockLogin(admin)
    .addCourse(course1)
    .mockStudentCourseStats(student.getId(), 25)
    .mockMatriculationEligibility(false)
    .mockEmptyStudyActivity()
    .build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(17l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, 1l, admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);

    mockBuilder
      .addCourseStaffMember(workspace.getId(), courseStaffMember)
      .addCourseStudent(workspace.getId(), mcs)
      .build();
    mockBuilder.addStudentToStudentGroup(2l, student).addStaffMemberToStudentGroup(2l, admin).mockPersons().mockStudents().mockStudyProgrammes().mockStudentGroups();
    try {
      navigate("/guider", false);
      waitAndClick(".application-list__header-primary>span");
       
      waitAndClick(".button-pill--add-note span");

      sendKeys(".env-dialog__input", "Task from guider.");
      addTextToCKEditor("Do some stuff!");
      waitAndClick(".button--dialog-execute");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      
      assertText(".notes .notes__item .notes__item-header span", "Task from guider.");
      assertText(".notes .notes__item .notes__item-body p", "Do some stuff!");
      
      logout();
      mockBuilder.mockLogin(student);
      login();
      assertText(".note__header .note__title", "Task from guider.");
      waitAndClick(".note__header .note__title");
      waitForVisible(".note__description");
      assertText(".note__description p", "Do some stuff!");
      navigate("/records", false);
      assertText(".notes .notes__item .notes__item-header span", "Task from guider.");
      assertText(".notes .notes__item .notes__item-body p", "Do some stuff!");
      assertText(".notes .notes__item .notes__item-author", "Admin Person");
      waitAndClick(".notes .notes__item .icon-more_vert");
      waitAndClick(".dropdown__container-item");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      logout();
      mockBuilder.mockLogin(admin);
      login();
      selectEnglishLocale();
      navigate("/guider", false);
      waitAndClick(".application-list__header-primary>span");
      assertText(".notes .notes__item .notes__item-status.notes__item-status--pending", "Pending");
      waitAndClick(".notes .notes__item .icon-more_vert");
      waitAndClick(".dropdown__container-item:first-child");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      assertText(".notes .notes__item .notes__item-status.notes__item-status--done", "Done");
      waitAndClick(".notes .notes__item .icon-trash");
      assertPresent(".notification-queue__items .notification-queue__item--success");
      waitAndClick(".tabs--notes #tabControl-archived");
      assertText("#tabPanel-archived .notes .notes__item .notes__item-header span", "Task from guider.");
      assertText("#tabPanel-archived .notes .notes__item .notes__item-body p", "Do some stuff!");
    } finally {
      archiveUserByEmail(student.getEmail());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
