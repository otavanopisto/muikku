package fi.muikku.ui.base;

import org.junit.Test;

import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.muikku.atests.Workspace;

public class GuiderTestsBase extends AbstractUITest {

  @Test
  public void filterByNameTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
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
    Workspace workspace2 = createWorkspace("diffentcourse", "Second test course", "2", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate("/guider", true);
      waitAndClick(String.format("#workspace-%d>a", workspace.getId()));
      assertText(".gt-user .gt-user-meta-topic>span", "Test User");
    } finally {
      deleteWorkspace(workspace2.getId());
      deleteWorkspace(workspace.getId());
    }
  }
  
}