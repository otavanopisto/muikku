package fi.otavanopisto.muikku.ui.base.course.materials;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.io.File;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
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

public class CourseMaterialsPageTestsBase extends AbstractUITest {

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
    }
  )
  public void fileFieldTestAdmin() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      File testFile = getTestFile();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 
            "EXERCISE");
        try {
          logout();
          mockBuilder.mockLogin(student).build();
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__filefield-wrapper .file-uploader__field");
          sendKeys(".material-page__filefield-wrapper .file-uploader__field", testFile.getAbsolutePath());
          waitForNotVisible(".material-page__field-answer-synchronizer");
          waitForPresent(".file-uploader__item--taskfield .file-uploader__item-download-icon");
          waitForVisible(".notification-queue__item--success");
          waitForNotVisible(".material-page__field-answer-synchronizer");
          
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          assertTextIgnoreCase(".file-uploader__item-title", testFile.getName());
          
          waitForPresent(".file-uploader__item-delete-icon");
          waitAndClick(".file-uploader__item-delete-icon");
          waitForVisible(".dialog--confirm-remove-answer-dialog .button--standard-ok");
          waitAndClick(".button--standard-ok");
//        Timing problem where when debugging everything works fine, but at normal speed it gives error on saving empty field. Hence the sleep.
//        Watching for below might resolve this.
          waitForNotVisible(".material-page__field-answer-synchronizer");
//          sleep(1500);
          waitForVisible(".file-uploader__hint");
          assertNotPresent(".file-uploader__item-title");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseMaterialExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page .material-page__title");
        assertText(".material-page .material-page__title", "1.0 Testimateriaali");
        waitForPresent(".material-page .material-page__content");
        assertVisible(".material-page .material-page__content");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void courseMaterialTOCHighlightTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
          "EXERCISE");
      try {
        WorkspaceFolder workspaceFolder2 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 2, "Test material 2.0", "DEFAULT");
  
        WorkspaceHtmlMaterial htmlMaterial2 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder2.getId(), 
            "2.0 Testmaterial", "text/html;editor=CKEditor", 
            "<html><body><p>Test Matherial:  Lorem ipsum dolor sit amet </p><p>Senim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
            "EXERCISE");
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitAndClick(String.format("a[href='#p-%d']", htmlMaterial2.getId()));
          waitForPresent(String.format("a.active[href='#p-%d']", htmlMaterial2.getId()));
          assertVisible(String.format("a.active[href='#p-%d']", htmlMaterial2.getId()));
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial2.getId());
        }
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
        deleteWorkspace(workspace.getId());
      }
      
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseMaterialEvaluatedClassTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
          "EVALUATED");
      try {
        selectFinnishLocale();
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".button--muikku-submit-assignment");
        assertTextIgnoreCase(".button--muikku-submit-assignment", "Palauta tehtävä");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseMaterialExerciseClassTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
          "EXERCISE");
      try {
        selectFinnishLocale();
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".button--muikku-check-exercises");
        assertTextIgnoreCase(".button--muikku-check-exercises", "Palauta harjoitustehtävä");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
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
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerTextFieldTestAdmin() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__textfield");
        selectFinnishLocale();
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "");
        waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
        waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "field value");
        waitForNotVisible(".material-page__field-answer-synchronizer");
        waitAndClick(".button--muikku-check-exercises");
        waitUntilContentChanged(".button--muikku-check-exercises", "Palauta harjoitustehtävä");
        assertTextIgnoreCase(".button--muikku-check-exercises", "Harjoitustehtävä palautettu");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
        waitForValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
        assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "field value");
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
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerTextFieldTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
    MockCourseStudent courseStudent = new MockCourseStudent(1l, course1.getId(), student.getId());
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .addCourseStudent(course1.getId(), courseStudent)
      .build();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 
            "EXERCISE");
        logout();
        try {
          mockBuilder.mockLogin(student);
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          selectFinnishLocale();
          waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
          assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "");
          waitAndClick(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
          waitAndSendKeys(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "field value");
          waitForNotVisible(".material-page__field-answer-synchronizer");
          waitAndClick(".button--muikku-check-exercises");
          waitUntilContentChanged(".button--muikku-check-exercises", "Palauta harjoitustehtävä");
          assertTextIgnoreCase(".button--muikku-check-exercises", "Harjoitustehtävä palautettu");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForVisible(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
          waitForValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input");
          assertValue(".content-panel__container .content-panel__body .content-panel__item .material-page--exercise .material-page__textfield input", "field value");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerDropdownTestAdmin() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-22p0Ll4KipuGHcP9n6W1qXBU&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;un&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;dos&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;tres&quot;,&quot;correct&quot;:false}]}\" /><select name=\"muikku-field-22p0Ll4KipuGHcP9n6W1qXBU\"></select></object></p>", 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__selectfield");
        selectOption(".material-page__selectfield", "2");
        sleep(1000);
        waitForNotVisible(".material-page__field-answer-synchronizer");
        assertSelectValue(".material-page__selectfield", "2");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__selectfield");
        assertSelectedOption(".material-page__selectfield", "dos");
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerDropdownTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
    MockCourseStudent courseStudent = new MockCourseStudent(2l, course1.getId(), student.getId());
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .addCourseStudent(course1.getId(), courseStudent)
      .build();
    
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-22p0Ll4KipuGHcP9n6W1qXBU&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;un&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;dos&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;tres&quot;,&quot;correct&quot;:false}]}\" /><select name=\"muikku-field-22p0Ll4KipuGHcP9n6W1qXBU\"></select></object></p>", 
            "EXERCISE");
        logout();        
        try {
          mockBuilder.mockLogin(student);
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__selectfield");
          selectOption(".material-page__selectfield", "2");
          sleep(1000);
          waitForNotVisible(".material-page__field-answer-synchronizer");
          assertSelectValue(".material-page__selectfield", "2");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__selectfield");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__selectfield");
          assertSelectedOption(".material-page__selectfield", "dos");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
        
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerRadioButtonsTestAdmin() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB&quot;,&quot;listType&quot;:&quot;radio-vertical&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Koi&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Koppis&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Muurahainen&quot;,&quot;correct&quot;:true}]}\" /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"1\" /><label>Koi</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"2\" /><label>Koppis</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"3\" /><label>Muurahainen</label><br /></object></p><p>&nbsp;</p>", 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__radiobutton-items-wrapper");
        waitAndClickXPath("//input[@class='material-page__radiobutton' and @value='1']");
        sleep(1000);
        waitForNotVisible(".material-page__field-answer-synchronizer");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__radiobutton-items-wrapper");
        assertCheckedXPath("//input[@class='material-page__radiobutton' and @value='1']", true);
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerRadioButtonsTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
    MockCourseStudent courseStudent = new MockCourseStudent(4l, course1.getId(), student.getId());
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .addCourseStudent(course1.getId(), courseStudent)
      .build();

      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB&quot;,&quot;listType&quot;:&quot;radio-vertical&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Koi&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Koppis&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Muurahainen&quot;,&quot;correct&quot;:true}]}\" /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"1\" /><label>Koi</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"2\" /><label>Koppis</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"3\" /><label>Muurahainen</label><br /></object></p><p>&nbsp;</p>", 
            "EXERCISE");
        logout();        
        try {
          mockBuilder.mockLogin(student);
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__radiobutton-items-wrapper");
          waitAndClickXPath("//input[@class='material-page__radiobutton' and @value='1']");
          sleep(1000);
          waitForNotVisible(".material-page__field-answer-synchronizer");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__radiobutton-items-wrapper");
          assertCheckedXPath("//input[@class='material-page__radiobutton' and @value='1']", true);
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerCheckboxTestAdmin() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.multiselect\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nKTdumfsakZc5wFgru1LJoPs&quot;,&quot;listType&quot;:&quot;checkbox-horizontal&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;test1&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;test2&quot;,&quot;correct&quot;:false}]}\" /><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"1\" /><label>test1</label><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"2\" /><label>test2</label></object></p>", 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitAndClickXPath("//input[@type='checkbox' and @value='1']");
        sleep(1000);
        waitForNotVisible(".material-page__field-answer-synchronizer");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForClickableXPath("//input[@type='checkbox' and @value='1']");
        assertCheckedXPath("//input[@type='checkbox' and @value='1']", true);
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
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerCheckboxTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.multiselect\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nKTdumfsakZc5wFgru1LJoPs&quot;,&quot;listType&quot;:&quot;checkbox-horizontal&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;test1&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;test2&quot;,&quot;correct&quot;:false}]}\" /><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"1\" /><label>test1</label><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"2\" /><label>test2</label></object></p>", 
          "EXERCISE");
        
        try {
          mockBuilder.mockLogin(student);
          logout();
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitAndClickXPath("//input[@type='checkbox' and @value='1']");
          sleep(1000);
          waitForNotVisible(".material-page__field-answer-synchronizer");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForClickableXPath("//input[@type='checkbox' and @value='1']");
          assertCheckedXPath("//input[@type='checkbox' and @value='1']", true);
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
        
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
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.EDGE,
    }
  )
  public void answerConnectFieldByClickingTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .addStudent(student)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\"/><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-k08yrkwguDBhVbyFyqzvi0KB&quot;,&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Nakki&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Peruna&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Juusto&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Keppi&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Pulla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Hampurilainen&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;}]}\"/></object><br/></p>", 
          "EXERCISE");
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      logout();
      mockBuilder.mockLogin(student);
      login();
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__connectfield-wrapper");
        scrollIntoView(".material-page__connectfield-wrapper");
        waitAndClickXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Nakki')]");
        waitForPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Nakki')]//ancestor::span[@class='material-page__connectfield-term material-page__connectfield-term--selected \n" + 
            "                  ']");
        waitAndClickXPath("//span[@class='material-page__connectfield-counterpart-label' and contains(text(),'Keppi')]");
        
        waitAndClickXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Peruna')]");
        waitForPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Peruna')]//ancestor::span[@class='material-page__connectfield-term material-page__connectfield-term--selected \n" + 
            "                  ']");
        waitAndClickXPath("//span[@class='material-page__connectfield-counterpart-label' and contains(text(),'Hampurilainen')]");

        waitAndClickXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Juusto')]");
        waitForPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Juusto')]//ancestor::span[@class='material-page__connectfield-term material-page__connectfield-term--selected \n" + 
            "                  ']");
        waitAndClickXPath("//span[@class='material-page__connectfield-counterpart-label' and contains(text(),'Pulla')]");

        waitAndClick(".button--muikku-check-exercises");
        waitForPresent(".material-page__correct-answers-label");
        sleep(1500);
        assertClassPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Nakki')]/parent::span/parent::span", "correct-answer");
        assertClassPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Peruna')]/parent::span/parent::span", "incorrect-answer");
        assertClassPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Juusto')]/parent::span/parent::span", "incorrect-answer");
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
    }
  )
  public void answerConnectFieldByDraggingTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .addStudent(student)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\"/><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-k08yrkwguDBhVbyFyqzvi0KB&quot;,&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Nakki&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Peruna&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Juusto&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Keppi&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Pulla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Hampurilainen&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;}]}\"/></object><br/></p>", 
          "EXERCISE");
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      logout();
      mockBuilder.mockLogin(student);
      login();
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".material-page__connectfield-wrapper");
        scrollIntoView(".material-page__connectfield-wrapper");
        dragAndDropXPath("//span[@class='material-page__connectfield-counterpart-label' and contains(text(),'Keppi')]", "//span[@class='material-page__connectfield-counterparts-container']/span[1]", 10, 10);

        waitAndClick(".button--muikku-check-exercises");
        waitForPresent(".material-page__correct-answers-label");
        sleep(1500);
        assertClassPresentXPath("//span[@class='material-page__connectfield-term-label' and contains(text(),'Nakki')]/parent::span/parent::span", "correct-answer");
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
    }
  )
  public void fileFieldTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      File testFile = getTestFile();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 
            "EXERCISE");
        logout();
        MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
        mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
        mockBuilder.mockLogin(student);
        login();
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__filefield-wrapper .file-uploader__field");
          sendKeys(".material-page__filefield-wrapper .file-uploader__field", testFile.getAbsolutePath());
          waitForPresent(".file-uploader__item--taskfield .file-uploader__item-download-icon");
          waitForVisible(".notification-queue__item--success");
          sleep(500);
          
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          assertTextIgnoreCase(".file-uploader__item-title", testFile.getName());
          
          waitForPresent(".file-uploader__item-delete-icon");
          waitAndClick(".file-uploader__item-delete-icon");
          waitForVisible(".dialog--confirm-remove-answer-dialog .button--standard-ok");
          waitAndClick(".button--standard-ok");
//        Timing problem where when debugging everything works fine, but at normal speed it gives error on saving empty field. Hence the sleep.
          sleep(1500);
          waitForVisible(".file-uploader__hint");
          assertNotPresent(".file-uploader__item-title");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
        
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
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.SAFARI,
      }
    )
  public void sorterFieldWithAsciiMathSupportTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.sorter\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" "
            + "value=\"{&quot;name&quot;:&quot;muikku-field-2lIF1dGXqMJtFA2M2el2aSaF&quot;,&quot;items&quot;:[{&quot;id&quot;:&quot;f07wb&quot;,&quot;name&quot;:&quot;`5x(a/(a + c)) = d`&quot;},"
            + "{&quot;id&quot;:&quot;tfqd8&quot;,&quot;name&quot;:&quot;dsaf&quot;},{&quot;id&quot;:&quot;y3l26&quot;,&quot;name&quot;:&quot;54et&quot;}]}\" /></object></p>"
            + "<p>Mea facete feugiat scriptorem ei, ex vidit everti laoreet mea. Ius soleat consectetuer eu, docendi mandamus iudicabit vis ne. Aliquam detracto per te, "
            + "ne fabulas consulatu nec, modo ocurreret assentior quo an. Ius invenire similique ei, et aeque consequat per. Has in facete delicata praesent, mei no lorem ignota. "
            + "Eu eam dictas ceteros petentium.<br />&nbsp;</p>",
            "EXERCISE");
        logout();
        MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
        mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
        mockBuilder.mockLogin(student);
        login();
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForVisible(".material-page__sorterfield-wrapper");
          assertVisible(".material-page__sorterfield-wrapper");
          waitForPresent(".material-page__sorterfield-item .MathJax_SVG");
          waitForAttributeToHaveValue(".material-page__sorterfield-item .MathJax_SVG", "data-mathml");
          String mathml = getAttributeValue(".material-page__sorterfield-item .MathJax_SVG", "data-mathml");
          assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
          dragAndDropWithOffSetAndTimeout(".material-page__sorterfield-item:first-child", ".material-page__sorterfield-item:nth-child(2)", 20, 0);
          waitForAttributeToHaveValue(".material-page__sorterfield-item .MathJax_SVG", "data-mathml");
          mathml = getAttributeValue(".material-page__sorterfield-item .MathJax_SVG", "data-mathml");
          assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
          sleep(1000);
          waitAndClick(".button--muikku-check-exercises");
          waitForVisible(".material-page__field-answer-examples--sorterfield");
          mathml = getAttributeValue(".material-page__field-answer-examples--sorterfield .MathJax_SVG", "data-mathml");
          assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE
    }
  )
  public void organizerFieldWithAsciiMathSupportTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
  
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.organizer\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" "
            + "value=\"{&quot;name&quot;:&quot;muikku-field-yFfjVqYptKe076qYHJDhJUW8&quot;,&quot;termTitle&quot;:&quot;Testi&quot;,&quot;terms&quot;"
            + ":[{&quot;id&quot;:&quot;t2&quot;,&quot;name&quot;:&quot;tarminen&quot;},{&quot;id&quot;:&quot;t3&quot;,&quot;name&quot;:&quot;torminen&quot;}"
            + ",{&quot;id&quot;:&quot;t4&quot;,&quot;name&quot;:&quot;`5x(a/(a + c)) = d`&quot;},{&quot;id&quot;:&quot;t5&quot;,&quot;name&quot;:&quot;dswe&quot;}],"
            + "&quot;categories&quot;:[{&quot;id&quot;:&quot;c1&quot;,&quot;name&quot;:&quot;Test1&quot;},{&quot;id&quot;:&quot;c2&quot;,&quot;name&quot;:&quot;test2&quot;}],"
            + "&quot;categoryTerms&quot;:[{&quot;category&quot;:&quot;c1&quot;,&quot;terms&quot;:[&quot;t2&quot;,&quot;t3&quot;,&quot;t4&quot;]},{&quot;category&quot;:&quot;c2&quot;"
            + ",&quot;terms&quot;:[&quot;t4&quot;,&quot;t5&quot;]}]}\" /></object></p>", 
            "EXERCISE");
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".material-page__organizerfield-terms");
          waitForPresent(".material-page__organizerfield-categories");
          waitForVisible(".material-page__organizerfield-terms .MathJax_SVG");
          
          waitForAttributeToHaveValue(".material-page__organizerfield-terms .MathJax_SVG", "data-mathml");
          String mathml = getAttributeValue(".material-page__organizerfield-terms .MathJax_SVG", "data-mathml");
          assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
          waitForVisible("div .material-page__organizerfield-term:nth-child(1)");
          dragAndDropWithOffSetAndTimeout("div .material-page__organizerfield-term:nth-child(1)", ".material-page__organizerfield-category:nth-child(1)", 80, 50);
          dragAndDropWithOffSetAndTimeout("div .material-page__organizerfield-term:nth-child(2)", ".material-page__organizerfield-category:nth-child(1)", 80, 50);
          dragAndDropWithOffSetAndTimeout("div .material-page__organizerfield-term:nth-child(3)", ".material-page__organizerfield-category:nth-child(1)", 80, 50);
          dragAndDropWithOffSetAndTimeout("div .material-page__organizerfield-term:nth-child(4)", ".material-page__organizerfield-category:nth-child(2)", 120, 50);
  //        TODO: Remove sleep when concurrent save and submit issue fixed
          sleep(350);
          waitAndClick(".button--muikku-check-exercises");
          waitForVisible(".material-page__correct-answers");
          assertTextIgnoreCase(".material-page__correct-answers-data", "0 / 1");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
 
//  @Test
//  @TestEnvironments (
//    browsers = {
//      TestEnvironments.Browser.CHROME,
//      TestEnvironments.Browser.CHROME_HEADLESS,
//      TestEnvironments.Browser.FIREFOX,
//      TestEnvironments.Browser.INTERNET_EXPLORER,
//      TestEnvironments.Browser.EDGE,
//      TestEnvironments.Browser.SAFARI,
//    }
//  )
//  public void connectFieldAsciiMathSupportTest() throws Exception {
//    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
//    Builder mockBuilder = mocker();
//    try {
//      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
//      mockBuilder
//      .addStaffMember(admin)
//      .mockLogin(admin)
//      .addCourse(course1)
//      .build();
//      login();
//      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
//  
//      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
//      mockBuilder
//        .addCourseStaffMember(course1.getId(), courseStaffMember)
//        .build();
//      try {
//        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
//        
//        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
//            "Test", "text/html;editor=CKEditor", 
//            "<p>Lorem not solor emut.</p><p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\" />"
//            + "<param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-r0iJ7LgkLdnysqQvJvIFffMf&quot;,&quot;fields&quot;:[{&quot;name&quot;"
//            + ":&quot;1&quot;,&quot;text&quot;:&quot;`5x(a/(a + c)) = d`&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;perti&quot;},"
//            + "{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;sampo&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Ei&quot;},"
//            + "{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Kylla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;kunta&quot;}],&quot;connections&quot;"
//            + ":[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},"
//            + "{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;}]}\" /></object></p> ", 1l, 
//            "EXERCISE");
//        try {
//          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
//          waitForPresent(String.format("#page-%d .muikku-connect-field-term #MathJax-Element-2-Frame", htmlMaterial.getId()));
//          assertVisible(String.format("#page-%d .muikku-connect-field-term #MathJax-Element-2-Frame", htmlMaterial.getId()));
//          waitForAttributeToHaveValue(".muikku-connect-field-term #MathJax-Element-2-Frame", "data-mathml");
//          String mathml = getAttributeValue(".muikku-connect-field-term #MathJax-Element-2-Frame", "data-mathml");
//          assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
//          waitAndClick("div[data-field-name='1']");
//          waitAndClick("div[data-field-value='A']");
//          
//          waitAndClick("div[data-field-name='2']");
//          waitAndClick("div[data-field-value='B']");
//  
//          waitAndClick("div[data-field-name='3']");
//          waitAndClick("div[data-field-value='C']");
//  //      TODO: Remove sleep when concurrent save and submit issue fixed
//          sleep(350);
//          waitAndClick("button.muikku-check-exercises");
//          waitForVisible(".correct-answers-count-data");
//          assertEquals("1 / 1", getWebDriver().findElement(By.cssSelector(".correct-answers-count-data")).getText());
//        } finally {
//          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
//        }
//      } finally {
//        deleteWorkspace(workspace.getId());
//      }
//    } finally {
//      mockBuilder.wiremockReset();
//    }
//  }    
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.CHROME_HEADLESS,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.EDGE,
    }
  )
  public void ckeditorTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");

        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.memo\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" "
            + "value=\"{&quot;name&quot;:&quot;muikku-field-DZWZRbQoPNOcxXN9BGxY5WGe&quot;,&quot;rows&quot;:&quot;&quot;,&quot;example&quot;:&quot;&quot;,&quot;richedit&quot;:true}\" /></object></p>",
            "EVALUATED");
        try {
          String contentInput = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis mattis purus pharetra sagittis. Mauris eget ullamcorper leo. Donec et sollicitudin neque. Mauris in dapibus augue."
              + "Vestibulum porta nunc sed est efficitur, sodales dictum est rutrum. Suspendisse felis nisi, rhoncus sit amet tincidunt et, pellentesque ut purus. Vivamus id sem non neque gravida egestas. "
              + "Nulla consectetur quam mi.";
          logout();
          mockBuilder.mockLogin(student).build();
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".content-panel__chapter-title-text");
          waitForElementToBeClickable(".cke_wysiwyg_div p");
          addTextToCKEditor(contentInput);
          waitForPresent(".material-page__field-answer-synchronizer--saved");
          navigate("/", false);
          waitForPresent(".panel__header-title");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".content-panel__chapter-title-text");
          String actualInput = getCKEditorContentInMaterials();
          assertEquals(contentInput, actualInput);
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
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
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.EDGE,
    }
  )
  public void memofieldTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();

    try {
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);

      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId());
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .addCourseStudent(course1.getId(), mockCourseStudent)
        .build();
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");

        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.memo\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" "
            + "value=\"{&quot;name&quot;:&quot;muikku-field-DZWZRbQoPNOcxXN9BGxY5WGe&quot;,&quot;rows&quot;:&quot;&quot;,&quot;example&quot;:&quot;&quot;,&quot;richedit&quot;:false}\" /></object></p>",
            "EVALUATED");
        try {
          String contentInput = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam convallis mattis purus pharetra sagittis. Mauris eget ullamcorper leo. Donec et sollicitudin neque. Mauris in dapibus augue."
              + "Vestibulum porta nunc sed est efficitur, sodales dictum est rutrum. Suspendisse felis nisi, rhoncus sit amet tincidunt et, pellentesque ut purus. Vivamus id sem non neque gravida egestas. "
              + "Nulla consectetur quam mi.";
          logout();
          mockBuilder.mockLogin(student).build();
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".content-panel__chapter-title-text");
          waitForElementToBeClickable(".material-page__memofield");
          sendKeys(".material-page__memofield", contentInput);
          waitForPresent(".material-page__field-answer-synchronizer--saved");
          navigate("/", false);
          waitForPresent(".panel__header-title");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          waitForPresent(".content-panel__chapter-title-text");
          waitForPresent(".material-page__memofield");
          String actualInput = getElementText(".material-page__memofield");
          assertEquals(contentInput, actualInput);
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
        }
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
}