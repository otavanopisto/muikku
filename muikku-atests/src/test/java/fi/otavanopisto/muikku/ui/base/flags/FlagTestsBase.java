package fi.otavanopisto.muikku.ui.base.flags;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

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

public class FlagTestsBase extends AbstractUITest {

  @Test
  public void createNewFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();
    try {
      navigate("/guider", false);
      waitForVisible("div.application-panel__toolbar span.icon-flag");
      click("div.application-panel__toolbar span.icon-flag");
      waitForVisible("div.dropdown--guider-labels input");
      click("div.dropdown--guider-labels input");
      sendKeys("div.dropdown--guider-labels input", "Test flag");

      waitAndClick("div.dropdown--guider-labels .link--full");
      waitAndClick("div.application-panel__toolbar span.icon-flag");
      waitForVisible(".application-panel__content-aside .icon-flag");
      waitForVisible(".application-panel__content-aside .icon-flag + span.menu__item-link-text");
      assertTextIgnoreCase(".application-panel__content-aside .icon-flag + span.menu__item-link-text", "Test flag");
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void filterByFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
    
      waitUntilElementCount(".user--guider", 2);
      waitForVisible(".application-panel__content-aside .menu__item-link--aside-navigation-guider-flag");
      click(".application-panel__content-aside .menu__item-link--aside-navigation-guider-flag");
      
      waitUntilElementCount(".user--guider", 1);
      assertTextIgnoreCase(".user--guider .application-list__header-primary span", "Second User");
      assertTextIgnoreCase(".user--guider .application-list__header-helper", "te...@example.com");
      assertTextIgnoreCase(".application-list__item-footer .labels .label", "Test Flaggi");      
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }

  }

  @Test
  public void editFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);

      waitAndClick(".application-panel__content-aside .icon-more_vert");
      waitAndClick(".menu__item-dropdown-list #editOption");
      
      waitForVisible("input#tagCategoryName");
      click("input#tagCategoryName");
      selectAllAndClear("input#tagCategoryName");
      sendKeys("input#tagCategoryName", "Edited title");
      waitForVisible("textarea#guiderLabelDescription");
      click("textarea#guiderLabelDescription");
      selectAllAndClear("textarea#guiderLabelDescription");
      sendKeys("textarea#guiderLabelDescription", "Edited description");
      click(".button--standard-ok");
      
      waitForNotVisible(".dialog--visible");
      waitForVisible(".application-panel__content-aside .icon-flag");
      waitForVisible(".application-panel__content-aside .icon-flag + span.menu__item-link-text");
      assertTextIgnoreCase(".application-panel__content-aside .icon-flag + span.menu__item-link-text", "Edited title");
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }

  }

  @Test
  public void unflagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
      waitForVisible(".application-panel__content-main .application-list__item.user:nth-child(1) input");
      click(".application-panel__content-main .application-list__item.user:nth-child(1) input");
      waitAndClick(".application-panel__actions-main .icon-flag");
      
      waitForVisible(".dropdown--guider-labels.visible .link--guider-label-dropdown.selected");
      click(".dropdown--guider-labels.visible .link--guider-label-dropdown.selected");
      
      waitAndClick(".application-panel__content-aside .icon-flag");
      waitForVisible(".application-panel__content-aside .menu__item-link.active");
      
      assertNotPresent(".application-list__item-header--student");
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void shareFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "admin@example.com", Sex.MALE);
    MockStaffMember testPerson = new MockStaffMember(2l, 2l, 1l, "Test", "Person", UserRole.ADMINISTRATOR, "090979-5434", "testperson@example.com", Sex.MALE);
    
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStaffMember(testPerson)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);

      waitAndClick(".application-panel__content-aside .icon-more_vert");
      waitAndClick(".menu__item-dropdown-list #editOption");
      waitForVisible("input#guiderLabelShare");
      waitForVisible("input#guiderLabelShare");
      click("input#guiderLabelShare");
      sendKeys("input#guiderLabelShare", "test");
      waitForVisible(".glyph--autocomplete-recipient");

      waitAndClick(".glyph--autocomplete-recipient");

      click(".button--standard-ok");
      
      waitForNotVisible(".dialog--visible");
      waitForClickable(".application-panel__content-aside .icon-more_vert");
      
      logout();
      mockBuilder.mockLogin(testPerson);
      login();

      navigate("/guider", false);

      waitForVisible(".application-panel__content-aside .menu__item-link-text");
      assertTextIgnoreCase(".application-panel__content-aside .menu__item-link-text", "Test Flaggi");
    } finally {
      deleteFlagShares(flagId);
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void deleteFlagTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(3l, 3l, "Second", "User", "teststudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    MockStudent student2 = new MockStudent(4l, 4l, "Thirdester", "User", "testsostudent@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "030584-5656", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).organizationId(1l).description("test course for testing").buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).organizationId(1l).description("Second test course").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .addStudent(student)
    .addStudent(student2)
    .mockLogin(admin)
    .addCourse(course1)
    .addCourse(course2)
    .build();
    login();
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    MockCourseStudent mcs2 = new MockCourseStudent(4l, course1, student2.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
      selectFinnishLocale();
      waitAndClick(".application-panel__content-aside .icon-more_vert");
      waitAndClick(".menu__item-dropdown-list #deleteOption");
      waitAndClick(".button--fatal.button--standard-ok");
      waitForNotVisible(".application-panel__content-aside .icon-more_vert");
      
      assertNotPresent(".application-panel__content-aside .icon-more_vert");
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}