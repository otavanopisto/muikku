package fi.muikku.ui.base;

import static org.junit.Assert.assertEquals;

import java.util.List;

import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.github.tomakehurst.wiremock.client.WireMock;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.pyramus.webhooks.WebhookPersonCreatePayload;
import fi.pyramus.webhooks.WebhookStaffMemberCreatePayload;

public class CourseMaterialsPageTestsBase extends AbstractUITest {

  @Test
  public void courseMaterialExistsTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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

  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1EvaluatedMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1EvaluatedMaterialDelete.sql"})
  public void courseMaterialEvaluatedClassTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.id("contentWorkspaceMaterials"));
    String actual = getWebDriver().findElementByCssSelector("#page-45>div").getAttribute("class");
    String expected = new String("muikku-page-assignment-type evaluated");
    assertEquals(expected, actual);
    WireMock.reset();
  }
  
  @Test
  @SqlBefore(value = {"sql/workspace1Setup.sql", "sql/workspace1ExerciseMaterialSetup.sql"})
  @SqlAfter(value = {"sql/workspace1Delete.sql", "sql/workspace1ExerciseMaterialDelete.sql"})
  public void courseMaterialExerciseClassTest() throws Exception {
    PyramusMocks.adminLoginMock();
    PyramusMocks.personsPyramusMocks();
    PyramusMocks.workspace1PyramusMock();
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    String payload = objectMapper.writeValueAsString(new WebhookStaffMemberCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    payload = objectMapper.writeValueAsString(new WebhookPersonCreatePayload((long) 4));
    webhookCall("http://dev.muikku.fi:8080/pyramus/webhook", payload);
    
    asAdmin().get("/test/reindex");
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testcourse/materials");
    waitForElementToBePresent(By.id("contentWorkspaceMaterials"));
    String actual = getWebDriver().findElementByCssSelector("#page-46>div").getAttribute("class");
    String expected = new String("muikku-page-assignment-type exercise");
    assertEquals(expected, actual);
    WireMock.reset();
  }
  
  @Test
  public void answerTextFieldTestAdmin() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
    
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
  public void answerConnectFieldByClickingTestAdmin() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
        String firstTermValue = getAttributeValue(".muikku-connect-field-term:first-child", "data-field-name");
        click(".muikku-connect-field-term:first-child");
        waitClassPresent(".muikku-connect-field-term:first-child", "muikku-connect-field-term-selected");
        String lastCounterpartValue = getAttributeValue(".muikku-connect-field-counterpart:last-child", "data-field-value"); 
        click(".muikku-connect-field-counterpart:last-child");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        List<WebElement> terms = getWebDriver().findElements(By.cssSelector(".muikku-connect-field-term"));
        List<WebElement> counterparts = getWebDriver().findElements(By.cssSelector(".muikku-connect-field-counterpart"));
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
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
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
        String firstTermValue = getAttributeValue(".muikku-connect-field-term:first-child", "data-field-name");
        String lastCounterpartValue = getAttributeValue(".muikku-connect-field-counterpart:last-child", "data-field-value"); 
        dragAndDrop(".muikku-connect-field-counterpart:last-child", ".muikku-connect-field-counterpart:first-child");
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d div.muikku-connect-field", htmlMaterial.getId()));
        List<WebElement> terms = getWebDriver().findElements(By.cssSelector(".muikku-connect-field-term"));
        List<WebElement> counterparts = getWebDriver().findElements(By.cssSelector(".muikku-connect-field-counterpart"));
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
}
