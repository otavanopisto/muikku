package fi.otavanopisto.muikku.ui.base.flags;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

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
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("testcourse").id((long) 3).description("test course for testing").organizationId(1l).buildCourse();
    Course course2 = new CourseBuilder().name("diffentscourse").id((long) 4).description("Second test course").organizationId(1l).buildCourse();
    mockBuilder
      .addStaffMember(admin)
      .addStudent(student)
      .mockLogin(admin)
      .addCourse(course1)
      .addCourse(course2)
      .build();
    login();
    Workspace workspace = createWorkspace(course1, true);
    Workspace workspace2 = createWorkspace(course2, true);
    MockCourseStudent mcs = new MockCourseStudent(3l, course1.getId(), student.getId());
    mockBuilder.
      addCourseStudent(course1.getId(), mcs).
      build();
    try {
      navigate("/guider", false);
      waitForPresentAndVisible("div.application-panel__toolbar span.icon-flag");
      click("div.application-panel__toolbar span.icon-flag");
      waitForPresentAndVisible("div.dropdown--guider-labels input");
      click("div.dropdown--guider-labels input");
      sendKeys("div.dropdown--guider-labels input", "Test flag");

      waitAndClick("div.dropdown--guider-labels .link--full");
      waitAndClick("div.application-panel__toolbar span.icon-flag");
      waitForPresentAndVisible(".application-panel__helper-container .icon-flag");
      waitForPresentAndVisible(".application-panel__helper-container .icon-flag + span.item-list__text-body");
      assertTextIgnoreCase(".application-panel__helper-container .icon-flag + span.item-list__text-body", "Test flag");
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
      waitForPresentAndVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > div:nth-child(1) > a");
      click("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > div:nth-child(1) > a");
      
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
      
      waitForPresentAndVisible("input.form-element__input--guider-label-name");
      click("input.form-element__input--guider-label-name");
      selectAllAndClear("input.form-element__input--guider-label-name");
      sendKeys("input.form-element__input--guider-label-name", "Edited title");
      waitForPresentAndVisible("textarea.form-element__textarea");
      click("textarea.form-element__textarea");
      selectAllAndClear("textarea.form-element__textarea");
      sendKeys("textarea.form-element__textarea", "Edited description");

      waitAndClick(".button--standard-ok");
      
      waitForNotVisible(".dialog--guider");
      waitForPresentAndVisible(".application-panel__helper-container .icon-flag");
      waitForPresentAndVisible(".application-panel__helper-container .icon-flag + span.item-list__text-body");
      assertTextIgnoreCase(".application-panel__helper-container .icon-flag + span.item-list__text-body", "Edited title");      
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
      waitForPresentAndVisible("div.application-panel__main-container .application-list__item.user:nth-child(1) input");
      click("div.application-panel__main-container .application-list__item.user:nth-child(1) input");
      waitAndClick(".application-panel__main-container--actions .icon-flag");
      
      waitForPresentAndVisible(".dropdown--guider-labels.visible .link--guider-label.selected");
      click(".dropdown--guider-labels.visible .link--guider-label.selected");
      
      waitAndClick(".application-panel__helper-container .icon-flag");
      waitForPresentAndVisible(".application-panel__helper-container .item-list__item.active");
      
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
      click("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      waitForPresentAndVisible(".button--guider-share-label");
      click(".button--guider-share-label");
      waitForPresentAndVisible(".autocomplete--guider .env-dialog__input");
      click(".autocomplete--guider .env-dialog__input");
      sendKeys(".autocomplete--guider .env-dialog__input", "test");
      waitForPresentAndVisible(".glyph--autocomplete-recipient");      
      waitAndClick(".glyph--autocomplete-recipient");

      waitAndClick("body > div:nth-child(12) div.dialog__footer > div > a.button.button--success.button--standard-ok");
      waitForPresentAndVisible(".button--guider-share-label");
      waitForNotVisible("body > div:nth-child(12)");
      waitAndClick("body > div:nth-child(11) > div > div > div.dialog__footer > div > a.button.button--success.button--standard-ok");    
      waitForNotVisible("body > div:nth-child(11)");
      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      
      logout();
      mockBuilder.mockLogin(testPerson);
      login();

      navigate("/guider", false);

      waitForPresentAndVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container .item-list__text-body");
      assertTextIgnoreCase("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container .item-list__text-body", "Test Flaggi");
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

      waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");
      click("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container a > span.button-pill.button-pill--navigation-edit-label > span");

      waitAndClick(".button--guider-remove-label");
      waitClassPresent(".button--guider-remove-label", "disabled");
      
      click(".button--standard-ok");
      waitForNotVisible(".container--dialog");
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