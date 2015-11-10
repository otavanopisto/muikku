package fi.muikku.ui.base.course.materials;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.util.List;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.muikku.ui.AbstractUITest;

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
  public void courseFullscreenReadingButtonExistsTest() throws Exception {
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
        waitForPresent(".wi-workspace-dock-navi-button-materials-reading");
        assertVisible(".wi-workspace-dock-navi-button-materials-reading");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  public void courseMaterialManagementButtonExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
      waitForPresent("#contentWorkspaceMaterials");
      assertPresent(".wi-workspace-dock-navi-button-materials-management");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
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
          waitForPresent("#contentWorkspaceMaterials");
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
        String actual = getWebDriver().findElementByCssSelector("#page-45>div").getAttribute("class");
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
        String actual = getWebDriver().findElementByCssSelector(String.format("#page-%d>div", htmlMaterial1.getId())).getAttribute("class");
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
  }
  
  @Test
  public void answerTextFieldTestStudent() throws Exception {
    loginStudent1();
    
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
  }
  
  @Test
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
  public void answerDropdownTestStudent() throws Exception {
    loginStudent1();
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
  public void answerRadioButtonsTestStudent() throws Exception {
    loginStudent1();
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
  public void answerCheckboxTestStudent() throws Exception {
    loginStudent1();
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
  public void answerFileFieldTestStudent() throws Exception {
    loginStudent1();
    
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
        assertPresent(String.format("#page-%d .muikku-file-input-field-description", htmlMaterial.getId()));
        assertText(String.format("#page-%d .muikku-file-input-field-description", htmlMaterial.getId()), "Add a file by clicking here or by dragging it into this box");
      } finally {
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }  
  
}