package fi.otavanopisto.muikku.ui.base.flags;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

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
    try {
      navigate("/guider", true);
      waitForPresentAndVisible("div.gt-user");
      click("div.gt-user .gt-user-name .gt-user-meta-topic>span");
      waitForPresentAndVisible("div.gt-user .mf-item-tool-btn");
      click("div.gt-user .mf-item-tool-btn");
      
      hoverOverElement(".gu-add-flag-widget-label");
      waitForPresentAndVisible(".gu-new-flag");
      click(".gu-new-flag");

      waitAndSendKeys(".guider-add-flag-dialog input[type='color']", "#009900");
      waitAndSendKeys("#guider-add-flag-dialog-name", "Test flag");

//      TODO: Textarea in this dialog wont work
//      waitAndClick("#guider-add-flag-dialog-description");
//      waitAndSendKeys("#guider-add-flag-dialog-description", "Test flag description");
      waitForPresentAndVisible(".guider-add-flag-dialog .ui-dialog-buttonset .create-button");
      click(".guider-add-flag-dialog .ui-dialog-buttonset .create-button");
      
      waitForPresent(".gu-flag>span.gu-flag-label");
      reloadCurrentPage();
      waitForPresent(".gu-flag>span.gu-flag-label");
      assertTextIgnoreCase(".gu-flag>span.gu-flag-label", "Test flag");
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
    }
  }
  
  
  
}