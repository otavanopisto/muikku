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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
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
      waitForVisible(".application-panel__helper-container .icon-flag");
      waitForVisible(".application-panel__helper-container .icon-flag + span.menu__item-link-text");
      assertTextIgnoreCase(".application-panel__helper-container .icon-flag + span.menu__item-link-text", "Test flag");
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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
    
      waitUntilElementCount(".user--guider", 2);
      waitForVisible(".application-panel__helper-container.application-panel__helper-container--guider .menu__item-link--aside-navigation-guider-flag");
      click(".application-panel__helper-container.application-panel__helper-container--guider .menu__item-link--aside-navigation-guider-flag");
      
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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);

      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      click("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      
      waitForVisible("input.form-element__input--guider-label-name");
      click("input.form-element__input--guider-label-name");
      selectAllAndClear("input.form-element__input--guider-label-name");
      sendKeys("input.form-element__input--guider-label-name", "Edited title");
      waitForVisible("textarea.form-element__textarea");
      click("textarea.form-element__textarea");
      selectAllAndClear("textarea.form-element__textarea");
      sendKeys("textarea.form-element__textarea", "Edited description");
      click(".button--standard-ok");
      
      waitForNotVisible(".dialog--guider-edit-label");
      waitForVisible(".application-panel__helper-container .icon-flag");
      waitForVisible(".application-panel__helper-container .icon-flag + span.menu__item-link-text");
      assertTextIgnoreCase(".application-panel__helper-container .icon-flag + span.menu__item-link-text", "Edited title");
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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
      waitForVisible("div.application-panel__main-container .application-list__item.user:nth-child(1) input");
      click("div.application-panel__main-container .application-list__item.user:nth-child(1) input");
      waitAndClick(".application-panel__main-container--actions .icon-flag");
      
      waitForVisible(".dropdown--guider-labels.visible .link--guider-label-dropdown.selected");
      click(".dropdown--guider-labels.visible .link--guider-label-dropdown.selected");
      
      waitAndClick(".application-panel__helper-container .icon-flag");
      waitForVisible(".application-panel__helper-container .menu__item-link.active");
      
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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);

      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      waitUntilAnimationIsDone(".dialog--guider-edit-label");
      sleep(1000);
      waitForVisible(".autocomplete__input input.tag-input__input--guider");
      click(".autocomplete__input input.tag-input__input--guider");

      sendKeys(".autocomplete__input input.tag-input__input--guider", "test");
      waitForVisible(".glyph--autocomplete-recipient");

      waitAndClick(".glyph--autocomplete-recipient");

      click(".dialog--guider-edit-label .button--standard-ok");
      
      waitForNotVisible(".dialog--guider-edit-label");
      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      
      logout();
      mockBuilder.mockLogin(testPerson);
      login();

      navigate("/guider", false);

      waitForVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container .menu__item-link-text");
      assertTextIgnoreCase("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container .menu__item-link-text", "Test Flaggi");
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
    MockCourseStudent mcs = new MockCourseStudent(3l, workspace.getId(), student.getId());
    MockCourseStudent mcs2 = new MockCourseStudent(4l, workspace.getId(), student2.getId());
    mockBuilder.
      addCourseStudent(workspace.getId(), mcs).
      addCourseStudent(workspace.getId(), mcs2).
      build();

    Long flagId = createFlag("Test Flaggi", "#990000", "Fishing flags");
    flagStudent(student.getId(), flagId);
    try {
      navigate("/guider", false);
      selectFinnishLocale();
      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");

      waitUntilAnimationIsDone(".dialog--guider-edit-label");
      sleep(1000);

      waitAndClick(".button--guider-remove-label");
      waitClassPresent(".button--guider-remove-label", "disabled");
      waitUntilAnimationIsDone(".button--guider-remove-label");
      waitUntilAnimationIsDone(".icon-flag");
      assertTextIgnoreCase(".button--guider-remove-label", "Poisto tallennuksessa");
      sleep(500);
      waitForClickable(".dialog--guider-edit-label .dialog__footer .button--standard-ok");
      waitAndClick(".dialog--guider-edit-label .dialog__footer .button--standard-ok");
      waitForNotVisible(".dialog--guider-edit-label");
      waitForNotVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      
      assertNotPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
    } finally {
      deleteFlags();
      deleteWorkspace(workspace.getId());
      deleteWorkspace(workspace2.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}