package fi.muikku.ui.base.course.users;

import org.junit.Test;

import fi.muikku.atests.Workspace;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;

public class CourseUsersTestsBase extends AbstractUITest {

  @Test
  public void courseUsersListTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      assertText(".workspace-students-listing-wrapper .workspace-users-name", "User, Test");
      waitForPresent(".workspace-teachers-listing-wrapper .workspace-users-name");
      assertText(".workspace-teachers-listing-wrapper .workspace-users-name", "Administrator, Test");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
}
