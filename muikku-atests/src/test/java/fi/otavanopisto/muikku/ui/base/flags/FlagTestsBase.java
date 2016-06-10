package fi.otavanopisto.muikku.ui.base.flags;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.interactions.Actions;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class FlagTestsBase extends AbstractUITest {

  @Test
  public void createNewFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", "3", Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();
    long flagId = 0;
    long studentFlagId = 0;
    try {
      navigate("/guider", true);
      waitForPresentAndVisible("div.gt-user");
      click("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      waitForPresentAndVisible("div.gt-user .mf-item-tool-btn");
      click("div.gt-user .mf-item-tool-btn");
      
      hoverOverElement(".gt-add-flag-widget-label");
      waitForPresentAndVisible(".gt-new-flag");
      click(".gt-new-flag");

      waitForPresent("input#guider-add-flag-dialog-color");
      setAttributeBySelector("input[type=\"color\"]", "value", "#009900");
      waitAndSendKeys("#guider-add-flag-dialog-name", "Test flag");
      waitForPresentAndVisible(".guider-add-flag-dialog .ui-dialog-buttonset .create-button");
      click(".guider-add-flag-dialog .ui-dialog-buttonset .create-button");
      
      waitForPresent(".gt-flag>span.gt-flag-label");
      reloadCurrentPage();
      waitForPresent("div[data-flag-id]");
      flagId = Long.parseLong(getAttributeValue("div.gt-flag", "data-flag-id"));
      waitForPresent("div[data-id]");
      studentFlagId = Long.parseLong(getAttributeValue("div.gt-flag", "data-id"));
      waitForPresent(".gt-flag>span.gt-flag-label");
      assertTextIgnoreCase(".gt-flag>span.gt-flag-label", "Test flag");
    } finally {
      deleteStudentFlag(studentFlagId);
      deleteFlag(flagId);
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
    }
  }
  
  @Test
  public void filterByFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", "3", Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    Long studentFlagId = flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", true);
      waitForPresentAndVisible("div.gt-user");
      waitForPresentAndVisible(".gt-filters a.gt-filter-link");
      click(".gt-filters a.gt-filter-link");
      
      waitForPresent("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      assertTextIgnoreCase("div.gt-user .gt-user-name .gt-user-meta-topic>span", "Thirdester User (Test Study Programme)");
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      deleteStudentFlag(studentFlagId);
      deleteFlag(flagId);
    }

  }

  @Test
  public void editFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", "3", Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    Long studentFlagId = flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", true);
      waitForPresentAndVisible("div.gt-user");
      waitForPresentAndVisible(".gt-filters a.gt-filter-link");
      click(".gt-filters a.gt-filter-link");
      
      waitForPresent("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      click("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      waitForPresentAndVisible(".gt-tool-view-profile>span");
      click(".gt-tool-view-profile>span");

      waitForPresent("div.gt-flag.icon-flag");
      hoverOverElement("div.gt-flag.icon-flag");
      waitForPresentAndVisible(".gt-edit-flag");
      click(".gt-edit-flag");
      
      waitForPresent("input#guider-edit-flag-dialog-color");
      setAttributeBySelector("input[type=\"color\"]", "value", "#009900");
      clearElement("#guider-edit-flag-dialog-name");
      waitAndSendKeys("#guider-edit-flag-dialog-name", "Test flag");
      clearElement("textarea#guider-edit-flag-dialog-description");
      waitAndSendKeys("textarea#guider-edit-flag-dialog-description", "Sailing flags");
      waitForPresentAndVisible(".ui-dialog-buttonset .save-button");
      click(".ui-dialog-buttonset .save-button");
      
      waitForPresent(".gt-flag-action-container");
      reloadCurrentPage();
      
      waitForPresent(".mf-widget.gt-user-view-flags-container .gt-flag>span.gt-flag-label");
      assertTextIgnoreCase(".mf-widget.gt-user-view-flags-container .gt-flag>span.gt-flag-label", "Test Flag");
      
      assertEquals("#009900", getAttributeValue("div.icon-flag", "data-flag-color"));
      
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      deleteStudentFlag(studentFlagId);
      deleteFlag(flagId);
    }

  }

  @Test
  public void unflagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", "3", Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", true);
      waitForPresentAndVisible("div.gt-user");
      waitForPresentAndVisible(".gt-filters a.gt-filter-link");
      click(".gt-filters a.gt-filter-link");
      
      waitForPresent("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      click("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      waitForPresentAndVisible(".gt-tool-view-profile>span");
      click(".gt-tool-view-profile>span");

      waitForPresent("div.gt-flag.icon-flag");
      hoverOverElement("div.gt-flag.icon-flag");
      waitForPresentAndVisible(".gt-remove-flag");
      click(".gt-remove-flag");
      waitForPresent(".gt-user-view-headline");
      
      reloadCurrentPage();
      waitForPresent(".gt-user-view-headline");
      assertNotPresent(".mf-widget.gt-user-view-flags-container .gt-flag>span.gt-flag-label");
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      deleteFlag(flagId);
    }

  }
  
}