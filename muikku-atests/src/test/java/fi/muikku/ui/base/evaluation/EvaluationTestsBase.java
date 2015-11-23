package fi.muikku.ui.base.evaluation;

import org.junit.Test;

import fi.muikku.plugins.material.model.Material;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;
import fi.muikku.atests.WorkspaceFolder;
import fi.muikku.atests.WorkspaceHtmlMaterial;

public class EvaluationTestsBase extends AbstractUITest {

  @Test
  public void evaluateStudentTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try {
      WorkspaceFolder workspaceFolder1 = createWorkspaceFolder(workspace.getId(), null, Boolean.FALSE, 1, "Test Course material folder", "DEFAULT");
      
      WorkspaceHtmlMaterial htmlMaterial1 = createWorkspaceHtmlMaterial(workspace.getId(), workspaceFolder1.getId(), 
          "1.0 Testimateriaali", "text/html;editor=CKEditor", 
          "<html><body><p>Testi materiaalia:  Lorem ipsum dolor sit amet </p><p>Proin suscipit luctus orci placerat fringilla. Donec hendrerit laoreet risus eget adipiscing. Suspendisse in urna ligula, a volutpat mauris. Sed enim mi, bibendum eu pulvinar vel, sodales vitae dui. Pellentesque sed sapien lorem, at lacinia urna. In hac habitasse platea dictumst. Vivamus vel justo in leo laoreet ullamcorper non vitae lorem</p></body></html>", 1l, 
          "EVALUATED");
      try{
        
      } finally {
        
      }
      try {
        navigate("/guider", true);
        sendKeys(".gt-search .search", "Second User");
        assertText(".gt-user .gt-user-meta-topic>span", "Second User");
      }finally{
        deleteWorkspaceHtmlMaterial(workspace.getId(), htmlMaterial1.getId());
      }
    } finally {
      deleteWorkspace(workspace.getId());

    }
  }
  
}