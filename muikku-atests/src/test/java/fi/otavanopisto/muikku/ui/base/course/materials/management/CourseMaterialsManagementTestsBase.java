package fi.otavanopisto.muikku.ui.base.course.materials.management;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;


public class CourseMaterialsManagementTestsBase extends AbstractUITest{

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void materialManagementAddChapterTest() throws Exception {
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
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
        waitForPresent(".button-pill--editing-master-switch");
        click(".button-pill--editing-master-switch");
        waitForPresent(".material-admin-panel--master-functions .button-pill__icon.icon-plus");
        click(".material-admin-panel--master-functions .button-pill__icon.icon-plus");
        waitForPresent(".material-admin-panel--chapter-functions .icon-pencil");
        click(".material-admin-panel--chapter-functions .icon-pencil");
        waitForVisible(".material-editor--visible .material-editor__title");
        clearElement(".material-editor--visible .material-editor__title");
        sendKeys(".material-editor--visible .material-editor__title", "Test title");
        waitAndClick(".button-pill__icon.icon-leanpub");
        waitClassPresent(".material-editor__buttonset-secondary .button-pill--material-editor-publish-page", "button-pill--disabled");
        sleep(500);
        waitAndClick(".button-pill--material-page-close-editor");
        waitForNotVisible(".tabs--material-editor");
        assertText(".content-panel__chapter-title ", "Test title");
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.CHROME_HEADLESS,
    }
  )
  public void courseMaterialLicenseOverrideCC010Test() throws Exception {
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
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
            "1.0 Testimateriaali", "text/html;editor=CKEditor", 
            "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          selectFinnishLocale();
          waitForPresent(".button-pill--editing-master-switch");
          click(".button-pill--editing-master-switch");
          waitForClickable(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          click(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          waitAndClickXPath("//div[@class='tabs__tab tabs__tab--material-editor tabs__tab--material-editor ' and contains(text(),'Tiedot')]");
          waitForClickable(".material-editor__add-license-container .form-element__select--material-editor");
          selectOption(".material-editor__add-license-container .form-element__select--material-editor", "CC0");
          waitAndClick(".material-editor__buttonset-secondary .icon-leanpub");
          waitForPresent(".material-editor__buttonset-secondary .button-pill--disabled .icon-leanpub");
          waitAndClick(".button-pill--material-page-close-editor .icon-arrow-left");
          waitForPresent(".material-page__metadata-container .material-page__license-item");
          assertTextIgnoreCase(".material-page__metadata-container .material-page__license-item", "https://creativecommons.org/publicdomain/zero/1.0/");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
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
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS,
      }
  )
  public void courseMaterialLicenseOverrideCC4Test() throws Exception {
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
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
            "1.0 Testimateriaali", "text/html;editor=CKEditor", 
            "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          selectFinnishLocale();
          waitForPresent(".button-pill--editing-master-switch");
          click(".button-pill--editing-master-switch");
          waitForClickable(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          click(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          waitAndClickXPath("//div[@class='tabs__tab tabs__tab--material-editor tabs__tab--material-editor ' and contains(text(),'Tiedot')]");
          waitForClickable(".material-editor__add-license-container .form-element__select--material-editor");
          selectOption(".material-editor__add-license-container .form-element__select--material-editor", "CC4");
          waitAndClick(".material-editor__buttonset-secondary .icon-leanpub");
          waitForPresent(".material-editor__buttonset-secondary .button-pill--disabled .icon-leanpub");
          waitAndClick(".button-pill--material-page-close-editor .icon-arrow-left");
          waitForPresent(".material-page__metadata-container .material-page__license-item");
          assertTextIgnoreCase(".material-page__metadata-container .material-page__license-item", "https://creativecommons.org/licenses/by-nc-sa/4.0");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
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
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS,
      }
  )
  public void courseMaterialLicenseOverrideCC3Test() throws Exception {
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
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
            "1.0 Testimateriaali", "text/html;editor=CKEditor", 
            "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          selectFinnishLocale();
          waitForPresent(".button-pill--editing-master-switch");
          click(".button-pill--editing-master-switch");
          waitForClickable(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          click(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          waitAndClickXPath("//div[@class='tabs__tab tabs__tab--material-editor tabs__tab--material-editor ' and contains(text(),'Tiedot')]");
          waitForClickable(".material-editor__add-license-container .form-element__select--material-editor");
          selectOption(".material-editor__add-license-container .form-element__select--material-editor", "CC3");
          waitAndClick(".material-editor__buttonset-secondary .icon-leanpub");
          waitForPresent(".material-editor__buttonset-secondary .button-pill--disabled .icon-leanpub");
          waitAndClick(".button-pill--material-page-close-editor .icon-arrow-left");
          waitForPresent(".material-page__metadata-container .material-page__license-item");
          assertTextIgnoreCase(".material-page__metadata-container .material-page__license-item", "https://creativecommons.org/licenses/by-nc-sa/3.0");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
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
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS,
      }
  )
  public void courseMaterialLicenseOverrideLinkTest() throws Exception {
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
        WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
            "1.0 Testimateriaali", "text/html;editor=CKEditor", 
            "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), false);
          selectFinnishLocale();
          waitForPresent(".button-pill--editing-master-switch");
          click(".button-pill--editing-master-switch");
          waitForClickable(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          click(".material-admin-panel--workspace-materials .button-pill--material-management-page");
          waitAndClickXPath("//div[@class='tabs__tab tabs__tab--material-editor tabs__tab--material-editor ' and contains(text(),'Tiedot')]");
          waitForClickable(".material-editor__add-license-container .form-element__select--material-editor");
          selectOption(".material-editor__add-license-container .form-element__select--material-editor", "text_or_link");
          waitForVisible(".license-selector .form-element__input--material-editor");
          sendKeys(".license-selector .form-element__input--material-editor", "www.test.com");
          waitAndClick(".material-editor__buttonset-secondary .icon-leanpub");
          waitForPresent(".material-editor__buttonset-secondary .button-pill--disabled .icon-leanpub");
          waitAndClick(".button-pill--material-page-close-editor .icon-arrow-left");
          waitForPresent(".material-page__metadata-container .material-page__license span");
          assertTextIgnoreCase(".material-page__metadata-container .material-page__license span", "www.test.com");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
        }
        
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }  
  
}
