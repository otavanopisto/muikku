package fi.otavanopisto.muikku.ui.base.course.journal;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import org.apache.commons.lang3.math.NumberUtils;
import org.joda.time.DateTime;
import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseJournalPageTestsBase extends AbstractUITest {

  @Test
  public void courseJournalToolsForTeacher() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
        waitForPresent(".workspace-journal-content-wrapper");
        assertVisible(".workspace-journal-teacher-tools-container");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }
    finally {
      mockBuilder.wiremockReset();
    }
  }


  @Test
  public void courseJournalNewEntryForStudent() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);

      Long courseId = NumberUtils.createLong(workspace.getIdentifier()); 
      MockCourseStudent courseStudent = new MockCourseStudent(1l, courseId, student.getId());
      mockBuilder.addCourseStudent(courseId, courseStudent).build();

      logout();
      mockBuilder.mockLogin(student).build();
      login();
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
        waitForPresent(".workspace-journal-content-wrapper");
        assertVisible(".workspace-journal-new-entry-button");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseJournalEntryAdded() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);

      Long courseId = NumberUtils.createLong(workspace.getIdentifier()); 
      MockCourseStudent courseStudent = new MockCourseStudent(1l, courseId, student.getId());
      mockBuilder.addCourseStudent(courseId, courseStudent).build();
      
      logout();
      mockBuilder.mockLogin(student).build();
      login();
      try {
        navigate(String.format("/workspace/%s/journal", workspace.getUrlName()), true);
        click(".workspace-journal-new-entry-button");
        addTextToCKEditor("content");
        sendKeys(".mf-textfield-subject", "title");
        click("input[type='button'][value='Create']");
        waitForPresent("#content");
        assertText(".workspace-journal-title", "title");
        assertText(".workspace-journal-content", "content");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }

  /*
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
   */
}