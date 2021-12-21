package fi.otavanopisto.muikku.ui.base.indexpage;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.io.IOException;

import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class IndexPageTestsBase extends AbstractUITest {

  @Test
  public void indexPageTest() throws IOException {
    navigate("", false);
    assertVisible(".hero");
    assertVisible("#studying");
    assertVisible("#videos");
    assertVisible("#news");
    assertVisible("#organization");
  }

  @Test
  public void studentLoginTest() throws Exception {
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, TestUtilities.toDate(1990, 1, 1), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStudent(student).mockLogin(student).build();
    try{
      login();
      assertVisible(".navbar .button-pill--profile");
    }finally {
      mockBuilder.wiremockReset();
    }

  }

  @Test
  public void adminLoginTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      login();
      assertVisible(".navbar .navbar__default-options");
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void loggedInIndexPageTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Second", "User", "teststudent@example.com", 1l, TestUtilities.toDate(1990, 1, 1), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    try{
      Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course, 1234").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .build();
      login();
      createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", date(115, 10, 12), date(125, 10, 12), false, true, null, null);
      long sender = fetchUserIdByEmail("admin@example.com");
      long recipient = fetchUserIdByEmail("teststudent@example.com");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      logout();

      MockCourseStudent mockCourseStudent = new MockCourseStudent(3l, course1.getId(), student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder
        .mockLogin(student)
        .addCourseStudent(workspace.getId(), mockCourseStudent)
        .build();
      login();
      try{
        waitForVisible(".navbar .button-pill--profile");
        assertVisible(".navbar .button-pill--profile");
        waitForVisible(".item-list--panel-workspaces .item-list__text-body");
        assertVisible(".item-list--panel-workspaces .item-list__text-body");
        assertTextIgnoreCase(".item-list--panel-workspaces .item-list__text-body", "testcourse (test extension)");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    } finally {
      mockBuilder.wiremockReset();
    }
  }
  
}
