package fi.muikku.ui.base.evaluation;

import org.junit.Test;

import com.github.tomakehurst.wiremock.client.VerificationException;

import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;

public class EvaluationTestsBase extends AbstractUITest {

  @Test
  public void evaluateStudentWorkspaceMaterialTest() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try {
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
        waitAndClick(".assignment-submitted");
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
        selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        assertClassPresent(".evaluation-assignment-wrapper", "assignment-evaluated");
      }finally{
        deleteMaterialEvalutionByMaterialIdAndUseremail(htmlMaterial.getId(), "testuser@made.up");
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void reEvaluateStudentWorkspaceMaterialTest() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try {
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
        waitAndClick(".assignment-submitted");
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
        selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        assertClassPresent(".evaluation-assignment-wrapper", "assignment-evaluated");
        
//      Re-evaluation
        waitAndClick(".assignment-submitted");
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation in re-evaluation.");
        selectOption("#grade", "2/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        waitAndClick(".assignment-submitted");
        waitForPresent("#grade");
        assertSelectedOption("#grade", "Failed");
        
      }finally{
        deleteMaterialEvalutionByMaterialIdAndUseremail(htmlMaterial.getId(), "testuser@made.up");
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void evaluateWorkspaceStudent() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
        "Test", "text/html;editor=CKEditor", 
        "<p><object type=\"application/vnd.muikku.field.text\"><param name=\"type\" value=\"application/json\" /><param name=\"content\" value=\"{&quot;name&quot;:&quot;muikku-field-nT0yyez23QwFXD3G0I8HzYeK&quot;,&quot;rightAnswers&quot;:[],&quot;columns&quot;:&quot;&quot;,&quot;hint&quot;:&quot;&quot;}\" /></object></p>", 1l, 
        "EVALUATED");
      try {
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
        waitAndClick("div[data-workspace-student='3']");
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
        selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        verify(postRequestedFor(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", 1, 1)))
          .withHeader("Content-Type", equalTo("application/json")));
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        assertClassPresent(".evaluation-student-wrapper", "workspace-evaluated");
      }finally{
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  
}