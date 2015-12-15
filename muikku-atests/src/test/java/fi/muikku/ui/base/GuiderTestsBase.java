package fi.muikku.ui.base;

import org.joda.time.DateTime;
import org.junit.Test;

import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;
import fi.muikku.atests.Workspace;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;
import static fi.muikku.mock.PyramusMock.mocker;

public class GuiderTestsBase extends AbstractUITest {

  @Test
  public void filterByNameTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com");
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    mocker().addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentcourse", "Second test course", "2", Boolean.TRUE);
//    PyramusMocks.personsPyramusMocks();
    try {
      navigate("/guider", true);
      sendKeys(".gt-search .search", "Second User");
      assertText(".gt-user .gt-user-meta-topic>span", "Second User");
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
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