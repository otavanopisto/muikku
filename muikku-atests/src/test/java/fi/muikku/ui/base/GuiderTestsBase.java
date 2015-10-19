package fi.muikku.ui.base;

import org.junit.Test;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;

public class GuiderTestsBase extends AbstractUITest {

  @Test
  public void workspaceFilterTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    createWorkspace("diffentcourse", "2", Boolean.TRUE);
    try {  
      navigate("/guider", true);
      sendKeys(".gt-search .search", "different");
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}