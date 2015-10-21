package fi.muikku.ui.base;

import org.junit.Test;

import fi.muikkku.ui.AbstractUITest;
import fi.muikkku.ui.PyramusMocks;
import fi.muikku.atests.Workspace;

public class GuiderTestsBase extends AbstractUITest {

  @Test
  public void filterByNameTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.guiderTestMock();
    try {
      navigate("/guider", true);
      sendKeys(".gt-search .search", "Second User");
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void filterByWorkspaceTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    createWorkspace("diffentcourse", "Second test course", "2", Boolean.TRUE);
    PyramusMocks.guiderTestMock();
    try {  
      navigate("/guider", true);
      
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}