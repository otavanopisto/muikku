package fi.muikku.ui.base.evaluation;

import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static com.github.tomakehurst.wiremock.client.WireMock.verify;
import static org.junit.Assert.assertEquals;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.Test;

import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;

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
        waitAndClick(".assignment-submitted");
        waitForPresent("#grade");
        assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
        waitForPresent("select[name='assessor']");
        assertValue("select[name='assessor']", "3");
        waitForPresent(".cke_contents");
        assertEquals("Test evaluation." ,getCKEditorContent());
      }finally{
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
        waitForPresent("#grade");
        assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
        waitForPresent("select[name='assessor']");
        assertValue("select[name='assessor']", "3");
        waitForPresent(".cke_contents");
        assertEquals("Test evaluation.", getCKEditorContent());
        
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation in re-evaluation.");
        selectOption("#grade", "2/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        waitAndClick(".assignment-submitted");
        waitForPresent("#grade");
        assertValue("#grade", "2/PYRAMUS@1/PYRAMUS");
        waitForPresent("select[name='assessor']");
        assertValue("select[name='assessor']", "3");
        waitForPresent(".cke_contents");
        assertEquals("Test evaluation.Test evaluation in re-evaluation.", getCKEditorContent());
      }finally{
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void evaluateWorkspaceStudent() throws Exception {
    String dateToday = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
    String requestBody =  "{\"id\":null,\"courseStudentId\":3,\"gradeId\":1,\"gradingScaleId\":1,\"assessorId\":4,\"date\":\""+ dateToday +"T00:00:00.000+02:00\",\"verbalAssessment\":\"<p>Test evaluation.</p>\\n\"}";
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
        waitAndClick(".evaluation-student-loaded");
        waitAndClick(".cke_contents");
        getWebDriver().switchTo().activeElement().sendKeys("Test evaluation.");
        selectOption("#grade", "1/PYRAMUS@1/PYRAMUS");
        selectOption("select[name='assessor']", "3");
        click(".save-evaluation-button");
        verify(postRequestedFor(urlEqualTo(String.format("/1/students/students/%d/courses/%d/assessments/", 1, 1)))
          .withHeader("Content-Type", equalTo("application/json"))
          .withRequestBody(equalTo(requestBody)));
        
        PyramusMocks.mockAssessedStudent1Workspace1();
        waitForPresentAndVisible(".evaluation-assignment-wrapper");
        assertClassPresent(".evaluation-student-wrapper", "workspace-evaluated");
        
        waitAndClick(".evaluation-student-loaded");
        waitForPresent("#grade");
        assertValue("#grade", "1/PYRAMUS@1/PYRAMUS");
        waitForPresent("select[name='assessor']");
        assertValue("select[name='assessor']", "3");
        waitForPresent(".cke_contents");
        assertEquals("Test evaluation." ,getCKEditorContent());
      }finally{
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  
}