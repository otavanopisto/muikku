package fi.muikku.ui.base;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import fi.muikkku.ui.AbstractUITest;
import fi.muikku.atests.Workspace;

public class CourseJournalPageTestsBase extends AbstractUITest {

  @Test
  public void courseJournalToolsForTeacher() throws Exception {
    loginAdmin();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    try {
      navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
      waitForPresent("#content");
      assertVisible(".workspace-journal-teacher-tools-container");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
}