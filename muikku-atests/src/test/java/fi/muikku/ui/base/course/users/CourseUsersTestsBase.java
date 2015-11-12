package fi.muikku.ui.base.course.users;

import org.junit.Test;

import fi.muikku.atests.Workspace;
import fi.muikku.ui.AbstractUITest;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    try{
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-generic-view-title");
      assertVisible(".workspace-students-listing-wrapper");      
    }finally{
      deleteWorkspace(workspace.getId());  
    }
  }
  
}
