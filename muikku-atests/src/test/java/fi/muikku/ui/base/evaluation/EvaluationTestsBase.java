package fi.muikku.ui.base.evaluation;

import org.junit.Test;

import fi.muikku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;

public class EvaluationTestsBase extends AbstractUITest {

  @Test
  public void evaluateStudentTest() throws Exception {
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try {
        loginStudent1();
        navigate(String.format("/workspace/%s/materials", workspace.getUrlName()), true);
        waitForPresent(String.format("#page-%d", htmlMaterial.getId()));
        
        assertVisible(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()));
        assertValue(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "");
        assertClassNotPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        sendKeys(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "field value");
        waitClassPresent(String.format("#page-%d .muikku-text-field", htmlMaterial.getId()), "muikku-field-saved");
        waitAndClick(String.format("#page-%d .muikku-submit-assignment", htmlMaterial.getId()));
        waitForPresentAndVisible(".notification-queue-item-success");
        waitForElementToBeClickable(String.format("#page-%d .muikku-withdraw-assignment", htmlMaterial.getId()));
        logout();
        loginAdmin();
        navigate(String.format("/evaluation"), true);
        
      }finally{
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}