package fi.otavanopisto.muikku.ui.base.guider;

import java.io.File;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
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
import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

public class GuiderTestsBase extends AbstractUITest {
  @Test
  public void filterByNameTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Test", "Student", "teststudentos@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    Long courseId = 2l;
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(3l, workspace.getId(), student2.getId());
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStudent(workspace.getId(), mcs2)
      .addCourseStaffMember(courseId, courseStaffMember)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick(".application-panel__tools-container>input");
      sendKeys(".application-panel__tools-container>input", "Second User");
      waitUntilElementCount(".application-list .user--guider", 1);
      waitForPresent(".application-list .user--guider .application-list__item-header--student .text--list-item-title");
      assertTextIgnoreCase(".application-list .user--guider .application-list__item-header--student .text--list-item-title", "Second User");
      assertTextIgnoreCase(".application-list .user--guider .application-list__item-header--student .text--list-item-helper-title", "te...@example.com");
      assertTextIgnoreCase(".application-list .user--guider .application-list__item-header--student .text--list-item-type-title", "Test Study Programme");
    } finally {
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void filterByWorkspaceTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Test", "Student", "teststudentos@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).addStudent(student2).mockLogin(admin).build();
    Long courseId = 2l;
    login();
    Workspace workspace = createWorkspace("testscourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
    Workspace workspace2 = createWorkspace("diffentscourse", "Second test course", "4", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(3l, workspace2.getId(), student2.getId());
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, courseId, admin.getId(), 7l);
    mockBuilder
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStudent(workspace.getId(), mcs2)
      .addCourseStaffMember(courseId, courseStaffMember)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a");
      waitUntilElementCount(".application-list .user--guider", 1);
      assertTextIgnoreCase(".application-list .user--guider .application-list__item-header--student .text--list-item-title", "Test Student");
    } finally {
      deleteWorkspace(workspace2.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
    browsers = {
      TestEnvironments.Browser.CHROME,
      TestEnvironments.Browser.FIREFOX,
      TestEnvironments.Browser.INTERNET_EXPLORER,
      TestEnvironments.Browser.EDGE,
      TestEnvironments.Browser.SAFARI
    }
  )
  public void uploadFileToStudentTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(1l, workspace.getId(), student.getId());
    
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, 1l, admin.getId(), 7l);

    mockBuilder
      .addCourseStaffMember(workspace.getId(), courseStaffMember)
      .addCourseStudent(workspace.getId(), mcs)
      .build();
    try {
      navigate("/guider", false);
      waitAndClick(".application-list .user--guider .application-list__item-header--student .text--list-item-title");
      scrollToEnd();
      waitForPresent(".file-uploader>input");
      File testFile = getTestFile();
      sendKeys(".file-uploader>input", testFile.getAbsolutePath());
      waitForPresent(".application-sub-panel__file-container a");
      assertTextStartsWith(".application-sub-panel__file-container a", testFile.getName());
//TODO: When records is done
//      logout();
//      mockBuilder.mockLogin(student);
//      login();
//      navigate("/records", false);
//      waitForPresent(".mf-item .mf-files .mf-file-name a");
//      assertText(".mf-item .mf-files .mf-file-name a", "img_100x100_3x8bit_RGB_circles_center_0016.png");
    } finally {
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
}
