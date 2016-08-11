package fi.otavanopisto.muikku.ui.base.course.materials;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.atests.WorkspaceFolder;
import fi.otavanopisto.muikku.atests.WorkspaceHtmlMaterial;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseMaterialsPageTestsBase extends AbstractUITest {

  @Test
  public void courseMaterialExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(".material-view");
        assertVisible("article p");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.PHANTOMJS
    }
  )
  public void courseFullscreenReadingButtonExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      login();
      maximizeWindow();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(".icon-fullscreen");
        assertVisible(".icon-fullscreen");
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
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.PHANTOMJS
    }
  )
  public void courseMaterialManagementButtonExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      login();
      maximizeWindow();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(".icon-cogs");
        hoverOverElement(".icon-cogs");
        waitForPresentAndVisible(".icon-edit-materials");
        assertPresent(".icon-edit-materials");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseManagementButtonExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(".icon-cogs");
        assertPresent(".icon-cogs");
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
      TestEnvironments.Browser.PHANTOMJS,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void courseTOCExistsTest() throws Exception {
    maximizeWindow();
    
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      try {
        WorkspaceFolder workspaceFolder2 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 2, "Test material 2.0", "DEFAULT");
  
        WorkspaceHtmlMaterial htmlMaterial2 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder2.getId(), 
            "2.0 Testmaterial", "text/html;editor=CKEditor", 
            "<html><body><p>Test Matherial:  Lorem ipsum dolor sit amet </p><p>Senim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
            "EXERCISE");
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent("#workspaceMaterialsTOCWrapper");
          assertVisible("#workspaceMaterialsTOCWrapper");
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial2.getId());
        }
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
   
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.PHANTOMJS,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void courseMaterialTOCHighlightTest() throws Exception {
    maximizeWindow();
    
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      try {
        WorkspaceFolder workspaceFolder2 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 2, "Test material 2.0", "DEFAULT");
  
        WorkspaceHtmlMaterial htmlMaterial2 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder2.getId(), 
            "2.0 Testmaterial", "text/html;editor=CKEditor", 
            "<html><body><p>Test Matherial:  Lorem ipsum dolor sit amet </p><p>Senim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
            "EXERCISE");
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitAndClick(String.format("a[href='#page-%d']", htmlMaterial2.getId()));
          waitForPresent(String.format("a.active[href='#page-%d']", htmlMaterial2.getId()));
          assertVisible(String.format("a.active[href='#page-%d']", htmlMaterial2.getId()));
        } finally {
          deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial2.getId());
        }
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  public void courseMaterialEvaluatedClassTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EVALUATED");
      try {
        getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
        waitForElementToBePresent(By.cssSelector(".muikku-page-assignment-type"));
        String actual = findElementByCssSelector("#page-45>div").getAttribute("class");
        String expected = new String("muikku-page-assignment-type evaluated");
        assertEquals(expected, actual);
        WireMock.reset();
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  public void courseMaterialExerciseClassTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      try {
        getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
        waitForElementToBePresent(By.cssSelector(".muikku-page-assignment-type"));
        String actual = findElementByCssSelector(String.format("#page-%d>div", htmlMaterial1.getId())).getAttribute("class");
        String expected = new String("muikku-page-assignment-type exercise");
        assertEquals(expected, actual);
        WireMock.reset();
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerTextFieldTestAdmin() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndSendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
        waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
        
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerTextFieldTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    try{
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
            "EXERCISE");
        logout();
        try {
          mockBuilder.mockLogin(student).build();
          login();
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
          assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
          waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerDropdownTestAdmin() throws Exception {
    loginAdmin();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-22p0Ll4KipuGHcP9n6W1qXBU&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;un&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;dos&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;tres&quot;,&quot;correct&quot;:false}]}\" /><select name=\"muikku-field-22p0Ll4KipuGHcP9n6W1qXBU\"></select></object></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
        selectOption(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "2");
        waitClassPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
        assertSelectedOption(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "dos");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerDropdownTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(student).build();
    login();
    try{
      maximizeWindow();    
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-22p0Ll4KipuGHcP9n6W1qXBU&quot;,&quot;listType&quot;:&quot;dropdown&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;un&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;dos&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;tres&quot;,&quot;correct&quot;:false}]}\" /><select name=\"muikku-field-22p0Ll4KipuGHcP9n6W1qXBU\"></select></object></p>", 1l, 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
          assertValue(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "");
          assertClassNotPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
          selectOption(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "2");
          waitClassPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
          assertSelectedOption(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "dos");        
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerRadioButtonsTestAdmin() throws Exception {
    loginAdmin();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB&quot;,&quot;listType&quot;:&quot;radio-vertical&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Koi&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Koppis&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Muurahainen&quot;,&quot;correct&quot;:true}]}\" /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"1\" /><label>Koi</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"2\" /><label>Koppis</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"3\" /><label>Muurahainen</label><br /></object></p><p>&nbsp;</p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndClick(".muikku-select-field input[value=\"1\"]");
        waitClassPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
        assertChecked(String.format("#page-%d .muikku-select-field input[value=\"1\"]", htmlMaterial.getId()), true);
        
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerRadioButtonsTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(student).build();
    login();
    try{
      maximizeWindow();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.select\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB&quot;,&quot;listType&quot;:&quot;radio-vertical&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Koi&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Koppis&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Muurahainen&quot;,&quot;correct&quot;:true}]}\" /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"1\" /><label>Koi</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"2\" /><label>Koppis</label><br /><input name=\"muikku-field-d9DLvRe9kvMvvOCdtFqH4TiB\" type=\"radio\" value=\"3\" /><label>Muurahainen</label><br /></object></p><p>&nbsp;</p>", 1l, 
            "EXERCISE");
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
          assertClassNotPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
          waitAndClick(".muikku-select-field input[value=\"1\"]");
          waitClassPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-select-field", htmlMaterial.getId()));
          assertChecked(String.format("#page-%d .muikku-select-field input[value=\"1\"]", htmlMaterial.getId()), true); 
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerCheckboxTestAdmin() throws Exception {
    loginAdmin();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.multiselect\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nKTdumfsakZc5wFgru1LJoPs&quot;,&quot;listType&quot;:&quot;checkbox-horizontal&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;test1&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;test2&quot;,&quot;correct&quot;:false}]}\" /><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"1\" /><label>test1</label><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"2\" /><label>test2</label></object></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndClick(".muikku-checkbox-field input[value=\"1\"]");
        waitClassPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()));
        assertChecked(String.format("#page-%d .muikku-checkbox-field input[value=\"1\"]", htmlMaterial.getId()), true);
        
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerCheckboxTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(student).build();
    login();
    try{
      maximizeWindow();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.multiselect\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nKTdumfsakZc5wFgru1LJoPs&quot;,&quot;listType&quot;:&quot;checkbox-horizontal&quot;,&quot;options&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;test1&quot;,&quot;correct&quot;:false},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;test2&quot;,&quot;correct&quot;:false}]}\" /><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"1\" /><label>test1</label><input name=\"muikku-field-nKTdumfsakZc5wFgru1LJoPs\" type=\"checkbox\" value=\"2\" /><label>test2</label></object></p>", 1l, 
          "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertVisible(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()));
          assertClassNotPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()), "muikku-field-saved");
          waitAndClick(".muikku-checkbox-field input[value=\"1\"]");
          waitClassPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-checkbox-field", htmlMaterial.getId()));
          assertChecked(String.format("#page-%d .muikku-checkbox-field input[value=\"1\"]", htmlMaterial.getId()), true);
          
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
    }
  )
  public void answerConnectFieldByClickingTestAdmin() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\"/><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-k08yrkwguDBhVbyFyqzvi0KB&quot;,&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Nakki&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Peruna&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Juusto&quot;},{&quot;name&quot;:&quot;4&quot;,&quot;text&quot;:&quot;Kinkku&quot;},{&quot;name&quot;:&quot;5&quot;,&quot;text&quot;:&quot;Leipä&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Keppi&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Pulla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Hampurilainen&quot;},{&quot;name&quot;:&quot;D&quot;,&quot;text&quot;:&quot;Kebab&quot;},{&quot;name&quot;:&quot;E&quot;,&quot;text&quot;:&quot;Halko&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;},{&quot;field&quot;:&quot;4&quot;,&quot;counterpart&quot;:&quot;D&quot;},{&quot;field&quot;:&quot;5&quot;,&quot;counterpart&quot;:&quot;E&quot;}]}\"/></object><br/></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()), "muikku-field-saved");
        String firstTermValue = getAttributeValue(".muikku-connect-field-term:nth-of-type(1)", "data-field-name");
        
        waitScrollAndClick(".muikku-connect-field-term:nth-of-type(1)");
        
        waitClassPresent(".muikku-connect-field-term:nth-of-type(1)", "muikku-connect-field-term-selected");
        String lastCounterpartValue = getAttributeValue(".muikku-connect-field-counterpart:nth-of-type(2)", "data-field-value"); 

        waitScrollAndClick(".muikku-connect-field-counterpart:nth-of-type(2)");
        
        waitClassPresent(".muikku-connect-field-counterpart:nth-of-type(1)", "muikku-connect-field-edited");
        waitClassPresent(".muikku-connect-field-term:nth-of-type(1)", "muikku-connect-field-edited");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        List<WebElement> terms = findElements(".muikku-connect-field-term");
        List<WebElement> counterparts = findElements(".muikku-connect-field-counterpart");
        assertTrue("No terms found", terms.size() > 0);
        for(int i = 0; i < terms.size();i++){
          if(terms.get(i).getAttribute("data-field-name") == firstTermValue){
            assertEquals(lastCounterpartValue, counterparts.get(i).getAttribute("data-field-value"));
          }
        }
        
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void answerConnectFieldByDraggingTestAdmin() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\"/><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-k08yrkwguDBhVbyFyqzvi0KB&quot;,&quot;fields&quot;:[{&quot;name&quot;:&quot;1&quot;,&quot;text&quot;:&quot;Nakki&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;Peruna&quot;},{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;Juusto&quot;},{&quot;name&quot;:&quot;4&quot;,&quot;text&quot;:&quot;Kinkku&quot;},{&quot;name&quot;:&quot;5&quot;,&quot;text&quot;:&quot;Leipä&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Keppi&quot;},{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Pulla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;Hampurilainen&quot;},{&quot;name&quot;:&quot;D&quot;,&quot;text&quot;:&quot;Kebab&quot;},{&quot;name&quot;:&quot;E&quot;,&quot;text&quot;:&quot;Halko&quot;}],&quot;connections&quot;:[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;},{&quot;field&quot;:&quot;4&quot;,&quot;counterpart&quot;:&quot;D&quot;},{&quot;field&quot;:&quot;5&quot;,&quot;counterpart&quot;:&quot;E&quot;}]}\"/></object><br/></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()), "muikku-field-saved");
        String firstTermValue = getAttributeValue(".muikku-connect-field-term:nth-of-type(5)", "data-field-name");
        String lastCounterpartValue = getAttributeValue(".muikku-connect-field-counterpart:nth-of-type(4)", "data-field-value"); 
        scrollIntoView(".muikku-connect-field-counterpart:nth-of-type(5)");
        
        dragAndDrop(".muikku-connect-field-counterpart:nth-of-type(4)", ".muikku-connect-field-counterpart:nth-of-type(5)");
        waitClassPresent(".muikku-connect-field-counterpart:nth-of-type(5)", "muikku-connect-field-edited");
        waitClassPresent(".muikku-connect-field-term:nth-of-type(5)", "muikku-connect-field-edited");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        List<WebElement> terms = findElements(".muikku-connect-field-term");
        List<WebElement> counterparts = findElements(".muikku-connect-field-counterpart");
        assertTrue("No terms found", terms.size() > 0);
        for(int i = 0; i < terms.size();i++){
          if(terms.get(i).getAttribute("data-field-name") == firstTermValue){
            assertEquals(lastCounterpartValue, counterparts.get(i).getAttribute("data-field-value"));
          }
        }
        
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
    }
  )
  public void answerFileFieldTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(student).build();
    login();
      try{
      File testFile = getTestFile();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 1l, 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
          assertClassNotPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
          assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 0);
          sendKeys(String.format("#page-%d .muikku-file-input-field-file-uploader-container input[type='file']", htmlMaterial.getId()), testFile.getAbsolutePath());
          waitClassPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
          assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 1);
          assertTextIgnoreCase(String.format("#page-%d .muikku-file-input-field-file .muikku-file-input-field-file-label a", htmlMaterial.getId()), testFile.getName());
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
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
    }
  )
  public void answerFileFieldTestAdmin() throws Exception {
    loginAdmin();
    
    File testFile = getTestFile();
    
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
        assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 0);
        sendKeys(String.format("#page-%d .muikku-file-input-field-file-uploader-container input[type='file']", htmlMaterial.getId()), testFile.getAbsolutePath());
        waitClassPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
        assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 1);
        assertTextIgnoreCase(String.format("#page-%d .muikku-file-input-field-file .muikku-file-input-field-file-label a", htmlMaterial.getId()), testFile.getName());
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
    }
  )
  public void removeFileFieldTestAdmin() throws Exception {
    loginAdmin();
    
    File testFile = getTestFile();
    
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
        assertClassNotPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
        assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 0);
        sendKeys(String.format("#page-%d .muikku-file-input-field-file-uploader-container input[type='file']", htmlMaterial.getId()), testFile.getAbsolutePath());
        waitClassPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
        assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 1);
        assertTextIgnoreCase(String.format("#page-%d .muikku-file-input-field-file .muikku-file-input-field-file-label a", htmlMaterial.getId()), testFile.getName());
        waitAndClick(".muikku-file-input-field-file-remove");
        waitAndClick(".delete-button span");
        waitForPresent(String.format("#page-%d .muikku-field-saved", htmlMaterial.getId()));
        assertPresent(String.format("#page-%d .muikku-file-input-field-description", htmlMaterial.getId()));
        reloadCurrentPage();
        waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
        assertNotPresent(".muikku-file-input-field-file");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
    }
  )
  public void removeFileFieldTestStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(student).build();
    login();
    try{
      File testFile = getTestFile();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
        
        WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
            "Test", "text/html;editor=CKEditor", 
            "<p><object type=\"application/vnd.muikku.field.file\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-lAEveKeKFmjD5wQwcMh4SW20&quot;}\" /><input name=\"muikku-field-lAEveKeKFmjD5wQwcMh4SW20\" type=\"file\" /></p>", 1l, 
            "EXERCISE");
        
        try {
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
          
          assertPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
          assertClassNotPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
          assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 0);
          sendKeys(String.format("#page-%d .muikku-file-input-field-file-uploader-container input[type='file']", htmlMaterial.getId()), testFile.getAbsolutePath());
          waitClassPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()), "muikku-field-saved");
          navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
          waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
          assertCount(String.format("#page-%d .muikku-file-input-field-file", htmlMaterial.getId()), 1);
          assertTextIgnoreCase(String.format("#page-%d .muikku-file-input-field-file .muikku-file-input-field-file-label a", htmlMaterial.getId()), testFile.getName());
          waitAndClick(".muikku-file-input-field-file-remove");
          waitAndClick(".delete-button span");
          waitForPresent(String.format("#page-%d .muikku-field-saved", htmlMaterial.getId()));
          assertPresent(String.format("#page-%d .muikku-file-input-field-description", htmlMaterial.getId()));
          reloadCurrentPage();
          waitForPresent(String.format("#page-%d .muikku-file-field", htmlMaterial.getId()));
          assertNotPresent(".muikku-file-input-field-file");
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
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.SAFARI,
      }
    )
  public void sorterFieldAsciiMathSupportTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p><object type=\"application/vnd.muikku.field.sorter\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" "
          + "value=\"{&quot;name&quot;:&quot;muikku-field-2lIF1dGXqMJtFA2M2el2aSaF&quot;,&quot;items&quot;:[{&quot;id&quot;:&quot;f07wb&quot;,&quot;name&quot;:&quot;`5x(a/(a + c)) = d`&quot;},"
          + "{&quot;id&quot;:&quot;tfqd8&quot;,&quot;name&quot;:&quot;dsaf&quot;},{&quot;id&quot;:&quot;y3l26&quot;,&quot;name&quot;:&quot;54et&quot;}]}\" /></object></p>"
          + "<p>Mea facete feugiat scriptorem ei, ex vidit everti laoreet mea. Ius soleat consectetuer eu, docendi mandamus iudicabit vis ne. Aliquam detracto per te, "
          + "ne fabulas consulatu nec, modo ocurreret assentior quo an. Ius invenire similique ei, et aeque consequat per. Has in facete delicata praesent, mei no lorem ignota. "
          + "Eu eam dictas ceteros petentium.<br />&nbsp;</p>", 1l, 
          "EXERCISE");
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-sorter-field", htmlMaterial.getId()));
        assertVisible(String.format("#page-%d .muikku-sorter-field", htmlMaterial.getId()));
        waitForPresent(".muikku-sorter-item #MathJax-Element-1-Frame");
        waitForAttributeToHaveValue(".muikku-sorter-item #MathJax-Element-1-Frame", "data-mathml");
        String mathml = getAttributeValue(".muikku-sorter-item #MathJax-Element-1-Frame", "data-mathml");
        assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
//      TODO: Fix functionality test if possible
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.SAFARI,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE
    }
  )
  public void organizerFieldAsciiMathSupportTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
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
          + ",&quot;terms&quot;:[&quot;t4&quot;,&quot;t5&quot;]}]}\" /></object></p>", 1l, 
          "EXERCISE");
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-term #MathJax-Element-1-Frame", htmlMaterial.getId()));
        assertVisible(String.format("#page-%d .muikku-term #MathJax-Element-1-Frame", htmlMaterial.getId()));
        waitForAttributeToHaveValue(".muikku-term #MathJax-Element-1-Frame", "data-mathml");
        String mathml = getAttributeValue(".muikku-term #MathJax-Element-1-Frame", "data-mathml");
        assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
        dragAndDrop("div[data-term-id=\"t4\"]", "div[data-category-id=\"c1\"]");
        dragAndDrop("div[data-term-id=\"t2\"]", "div[data-category-id=\"c1\"]");
        dragAndDrop("div[data-term-id=\"t3\"]", "div[data-category-id=\"c1\"]");
        
        dragAndDrop("div[data-term-id=\"t4\"]", "div[data-category-id=\"c2\"]");
        dragAndDrop("div[data-term-id=\"t5\"]", "div[data-category-id=\"c2\"]");
//        TODO: Remove sleep when concurrent save and submit issue fixed
        sleep(350);
        waitAndClick("button.muikku-check-exercises");
        waitForPresentAndVisible("span.muikku-field-examples");
        assertClassPresent("div[data-category-id='c1']", "muikku-field-correct-answer");
        assertClassPresent("div[data-category-id='c2']", "muikku-field-correct-answer");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
 
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI,
    }
  )
  public void connectFieldAsciiMathSupportTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    maximizeWindow();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder.getId(), 
          "Test", "text/html;editor=CKEditor", 
          "<p>Lorem not solor emut.</p><p><object type=\"application/vnd.muikku.field.connect\"><param name=\"type\" value=\"application/json\" />"
          + "<param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-r0iJ7LgkLdnysqQvJvIFffMf&quot;,&quot;fields&quot;:[{&quot;name&quot;"
          + ":&quot;1&quot;,&quot;text&quot;:&quot;`5x(a/(a + c)) = d`&quot;},{&quot;name&quot;:&quot;2&quot;,&quot;text&quot;:&quot;perti&quot;},"
          + "{&quot;name&quot;:&quot;3&quot;,&quot;text&quot;:&quot;sampo&quot;}],&quot;counterparts&quot;:[{&quot;name&quot;:&quot;A&quot;,&quot;text&quot;:&quot;Ei&quot;},"
          + "{&quot;name&quot;:&quot;B&quot;,&quot;text&quot;:&quot;Kylla&quot;},{&quot;name&quot;:&quot;C&quot;,&quot;text&quot;:&quot;kunta&quot;}],&quot;connections&quot;"
          + ":[{&quot;field&quot;:&quot;1&quot;,&quot;counterpart&quot;:&quot;A&quot;},{&quot;field&quot;:&quot;2&quot;,&quot;counterpart&quot;:&quot;B&quot;},"
          + "{&quot;field&quot;:&quot;3&quot;,&quot;counterpart&quot;:&quot;C&quot;}]}\" /></object></p> ", 1l, 
          "EXERCISE");
      try {
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d .muikku-connect-field-term #MathJax-Element-2-Frame", htmlMaterial.getId()));
        assertVisible(String.format("#page-%d .muikku-connect-field-term #MathJax-Element-2-Frame", htmlMaterial.getId()));
        waitForAttributeToHaveValue(".muikku-connect-field-term #MathJax-Element-2-Frame", "data-mathml");
        String mathml = getAttributeValue(".muikku-connect-field-term #MathJax-Element-2-Frame", "data-mathml");
        assertEquals("<math xmlns=\"http://www.w3.org/1998/Math/MathML\"><mstyle displaystyle=\"true\"><mn>5</mn><mi>x</mi><mrow><mo>(</mo><mfrac><mi>a</mi><mrow><mi>a</mi><mo>+</mo><mi>c</mi></mrow></mfrac><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mstyle></math>", mathml);
        waitAndClick("div[data-field-name='1']");
        waitAndClick("div[data-field-value='A']");
        
        waitAndClick("div[data-field-name='2']");
        waitAndClick("div[data-field-value='B']");

        waitAndClick("div[data-field-name='3']");
        waitAndClick("div[data-field-value='C']");
//      TODO: Remove sleep when concurrent save and submit issue fixed
        sleep(350);
        waitAndClick("button.muikku-check-exercises");
        waitForPresentAndVisible(".correct-answers-count-data");
        assertEquals("1 / 1", getWebDriver().findElement(By.cssSelector(".correct-answers-count-data")).getText());
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }    
  
  @Test
  public void courseMaterialLicenseOverrideCC010Test() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials-management", workspace.getUrlName()), true);
        waitForPresent(".page-license");
        click(".page-license");
        waitForPresent(".materials-management-page-license div select");
        waitForClickable(".materials-management-page-license div select");
        selectOption(".materials-management-page-license div select", "cc0-1.0");
        waitAndClick(".save-page-license");
        waitAndClick(String.format("#page-%d .publish-page", htmlMaterial1.getId()));
        waitAndClick(".ui-dialog-buttonset .publish-button");
        waitForPresent(".page-license");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format(".material-license", htmlMaterial1.getId()));
        assertTextIgnoreCase(String.format(".material-license", htmlMaterial1.getId()), "https://creativecommons.org/publicdomain/zero/1.0/");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseMaterialLicenseOverrideCC4Test() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials-management", workspace.getUrlName()), true);
        waitForPresent(".page-license");
        click(".page-license");
        waitForPresent(".materials-management-page-license div select");
        waitForClickable(".materials-management-page-license div select");
        selectOption(".materials-management-page-license div select", "cc-4.0");
        waitAndClick(".save-page-license");
        waitAndClick(String.format("#page-%d .publish-page", htmlMaterial1.getId()));
        waitAndClick(".ui-dialog-buttonset .publish-button");
        waitForPresent(".page-license");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format(".material-license", htmlMaterial1.getId()));
        assertTextIgnoreCase(String.format(".material-license", htmlMaterial1.getId()), "https://creativecommons.org/licenses/by-sa/4.0");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseMaterialLicenseOverrideCC3Test() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials-management", workspace.getUrlName()), true);
        waitForPresent(".page-license");
        click(".page-license");
        waitForPresent(".materials-management-page-license div select");
        waitForClickable(".materials-management-page-license div select");
        selectOption(".materials-management-page-license div select", "cc-3.0");
        waitAndClick(".save-page-license");
        waitAndClick(String.format("#page-%d .publish-page", htmlMaterial1.getId()));
        waitAndClick(".ui-dialog-buttonset .publish-button");
        waitForPresent(".page-license");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format(".material-license", htmlMaterial1.getId()));
        assertTextIgnoreCase(String.format(".material-license", htmlMaterial1.getId()), "https://creativecommons.org/licenses/by-sa/3.0");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseMaterialLicenseOverrideLinkTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EXERCISE");
      
      try {
        navigate(String.format("/workspace/%s/materials-management", workspace.getUrlName()), true);
        waitForPresent(".page-license");
        click(".page-license");
        waitForPresent(".materials-management-page-license div select");
        waitForClickable(".materials-management-page-license div select");
        selectOption(".materials-management-page-license div select", "link");
        waitAndSendKeys("input[name=\"license\"]", "www.test.com");
        waitAndClick(".save-page-license");
        waitAndClick(String.format("#page-%d .publish-page", htmlMaterial1.getId()));
        waitAndClick(".ui-dialog-buttonset .publish-button");
        waitForPresent(".page-license");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format(".material-license", htmlMaterial1.getId()));
        assertTextIgnoreCase(String.format(".material-license", htmlMaterial1.getId()), "www.test.com");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

}