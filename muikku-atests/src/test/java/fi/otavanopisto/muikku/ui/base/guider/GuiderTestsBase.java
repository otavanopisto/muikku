package fi.otavanopisto.muikku.ui.base.guider;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.io.File;
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

public class GuiderTestsBase extends AbstractUITest {
  @Test
  public void filterByNameTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststuqfwertdent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(3l, 3l, "Test", "Student", "teststrewtretudentos@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    Long courseId = 2l;
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(2l, courseId, student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(3l, courseId, student2.getId());

    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
      .addStudent(student)
      .addStudent(student2)
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStudent(workspace.getId(), mcs2)
      .addCourseStaffMember(courseId, courseStaffMember)
      .build();

    try {
      navigate("/guider", false);
      waitAndClick(".application-panel__toolbar .form-element--guider-toolbar input.form-element__input--main-function-search");
      sendKeys(".application-panel__toolbar .form-element--guider-toolbar input.form-element__input--main-function-search", "Second User");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(4l, 4l, "Second", "User", "teststuerdenert@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(5l, 5l, "Test", "Student", "teststudqweerntos@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    Long courseId = 2l;
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(4l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(5l, workspace2.getId(), student2.getId());
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStudent(workspace.getId(), mcs2)
      .addCourseStaffMember(courseId, courseStaffMember)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick("div.application-panel__helper-container a.item-list__item");
      waitUntilElementCount(".application-list .user--guider", 1);
      waitForPresent(".application-list__item-header .application-list__header-primary span");
      assertTextIgnoreCase(".application-list__item-header .application-list__header-primary span", "Test Student");
      assertCount(".application-list__item-header .application-list__header-primary", 1);
    } finally {
      archiveUserByEmail(student.getEmail());
      archiveUserByEmail(student2.getEmail());
      deleteWorkspace(workspace2.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void uploadFileToStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(6l, 6l, "Second", "User", "teststueradsfdent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(6l, workspace.getId(), student.getId());
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, 1l, admin.getId(), 7l);

    mockBuilder
      .addCourseStaffMember(workspace.getId(), courseStaffMember)
      .addCourseStudent(workspace.getId(), mcs)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick(".application-list__header-primary>span");
      waitForPresent(".file-uploader>input");
      scrollIntoView(".file-uploader>input");

      File testFile = getTestFile();
      sendKeys(".file-uploader>input", testFile.getAbsolutePath());
      waitForPresent("a.uploaded-files__item-title");
      assertTextStartsWith("a.uploaded-files__item-title", testFile.getName());
      logout();
      mockBuilder.mockLogin(student);
      login();
      navigate("/records", false);
      waitForPresent("a.uploaded-files__item-title");
      assertText("a.uploaded-files__item-title", "img_100x100_3x8bit_RGB_circles_center_0016.png");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
          .addCompositeCourseAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, date)
          .mockCompositeCourseAssessmentRequests()
          .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, false, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
          .mockStaffCompositeCourseAssessmentRequests();
        
        logout();
        mockBuilder.mockLogin(admin);
        login();

        mockBuilder
        .addStaffCompositeAssessmentRequest(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, TestUtilities.courseFromMockCourse(mockCourse), student, admin.getId(), date)
        .mockStaffCompositeCourseAssessmentRequests()
        .mockAssessmentRequests(student.getId(), courseId, courseStudent.getId(), "Hello!", false, true, date);
      
        mockBuilder.mockCourseAssessments(courseStudent, admin);          

        navigate("/guider", false);
        waitAndClick(".application-list__header-primary>span");
        waitForPresent(".application-list__header-secondary.workspace-activity .workspace-student__assessment-state>span>span");
        assertText(".application-list__header-secondary.workspace-activity .workspace-student__assessment-state>span>span", "E");
      }finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        deleteWorkspace(workspace.getId());
      }
    }finally {
      archiveUserByEmail(student.getEmail());
      mockBuilder.wiremockReset();  
    }
  }
      
  
}
