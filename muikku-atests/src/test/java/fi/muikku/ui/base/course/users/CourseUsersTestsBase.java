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
  
  @Test
  public void courseArchiveStudentTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-archive");
      waitAndClick(".archive-button");
      waitForClickable(".workspace-students-list");
      reloadCurrentPage();
      waitForPresent(".workspace-students-list");
      assertNotPresent("div[data-user-id='PYRAMUS-STUDENT-3']");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
  @Test
  public void courseUnarchiveStudentTest() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    PyramusMocks.personsPyramusMocks();
    try {
      navigate(String.format("/workspace/%s/users", workspace.getUrlName()), true);
      waitForPresent(".workspace-students-listing-wrapper .workspace-users-name");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-archive");
      waitAndClick(".archive-button");
      waitForClickable(".workspace-students-list");
      waitAndClick(".workspace-students-inactive");
      waitAndClick("div[data-user-id='PYRAMUS-STUDENT-3']>div.workspace-users-unarchive");
      waitAndClick(".unarchive-button");
      waitForClickable(".workspace-students-list");
      reloadCurrentPage();
      waitForPresent(".workspace-students-list");
      waitAndClick(".workspace-students-active");
      waitForPresent(".workspace-students-list");
      assertPresent("div[data-user-id='PYRAMUS-STUDENT-3']");      
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
  
}
