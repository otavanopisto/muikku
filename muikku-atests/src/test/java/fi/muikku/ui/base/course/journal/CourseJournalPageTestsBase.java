package fi.muikku.ui.base.course.journal;

import org.junit.Test;
import fi.muikku.ui.AbstractUITest;
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


  @Test
  public void courseJournalNewEntryForStudent() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    try {
      navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
      waitForPresent("#content");
      assertVisible(".workspace-journal-new-entry-button");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  public void courseJournalStudentsCantSeeEachOther() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    try {
      navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
      waitForPresent(".cke_wysiwyg_frame");
      switchToFrame(".cke_wysiwyg_frame");
      sendKeys(".cke_editable", "content");
      switchToDefaultFrame();
      sendKeys(".mf-textfield-subject", "title");
      click("button[value='Create']");
      waitForPresent("#content");
      assertText(".workspace-journal-title", "title");
      assertText(".workspace-journal-content", "content");
      
      loginStudent2();
      navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
      waitForPresent("#content");
      assertNotPresent(".workspace-journal-title");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }

  @Test
  public void courseJournalEntryAdded() throws Exception {
    loginStudent1();
    Workspace workspace = createWorkspace("testcourse", "1", Boolean.TRUE);
    try {
      navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
      waitForPresent(".cke_wysiwyg_frame");
      switchToFrame(".cke_wysiwyg_frame");
      sendKeys(".cke_editable", "content");
      switchToDefaultFrame();
      sendKeys(".mf-textfield-subject", "title");
      click("button[value='Create']");
      waitForPresent("#content");
      assertText(".workspace-journal-title", "title");
      assertText(".workspace-journal-content", "content");
    } finally {
      deleteWorkspace(workspace.getId());
    }
  }
}