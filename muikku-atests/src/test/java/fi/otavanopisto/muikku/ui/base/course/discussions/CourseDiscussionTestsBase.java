package fi.otavanopisto.muikku.ui.base.course.discussions;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMemberRoleEnum;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseDiscussionTestsBase extends AbstractUITest {
  
  @Test
  public void courseDiscussionSendMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-panel__actions-aside .button--primary-function");
      waitAndClick("input.env-dialog__input--new-discussion-thread-title");
      sendKeys("input.env-dialog__input--new-discussion-thread-title", "Test title for discussion");
      addTextToCKEditor("Test text for discussion.");
      waitAndClick(".env-dialog__actions .button--dialog-execute");
      waitForPresent(".application-list__title");
      assertText(".application-list__title", "Test title for discussion");
      waitForPresent(".application-list__item-body .rich-text>p");
      assertTextIgnoreCase(".application-list__item-body .rich-text>p", "Test text for discussion.");
    } finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionStudentCreateMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    try {
      logout();
      MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      mockBuilder.mockLogin(student);
      login();
      navigate(String.format("/workspace/%s/discussions", workspace.getUrlName()), false);
      waitAndClick(".application-panel__actions-aside .button--primary-function");
      waitAndClick("input.env-dialog__input--new-discussion-thread-title");
      sendKeys("input.env-dialog__input--new-discussion-thread-title", "Test title for discussion");
      addTextToCKEditor("Test text for discussion.");
      waitAndClick(".env-dialog__actions .button--dialog-execute");
      waitForPresent(".application-list__title");
      assertText(".application-list__title", "Test title for discussion");
      waitForPresent(".application-list__item-body .rich-text>p");
      assertTextIgnoreCase(".application-list__item-body .rich-text>p", "Test text for discussion.");
    }finally {
      archiveUserByEmail(student.getEmail());
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionAdminCreateAreaTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();    
    Workspace workspace = createWorkspace("Test", "test course for testing", "3", Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-panel__toolbar .button-pill__icon.icon-plus");
      waitAndSendKeys("input.env-dialog__input--new-discussion-area-name", "Test area");
      waitAndClick(".env-dialog__textarea");
      waitAndSendKeys(".env-dialog__textarea", "Description of test area");
      sleep(1000);
      waitAndClick(".env-dialog__actions .button--dialog-execute");
      waitUntilElementGoesAway(".env-dialog__actions", 10);
      waitAndClick(".application-panel__toolbar .react-select-override .react-select-override__control");
      waitUntilCountOfElements(".application-panel__toolbar .react-select-override .react-select-override__menu .react-select-override__option", 4);
      assertText(".application-panel__toolbar .react-select-override .react-select-override__menu .react-select-override__option:nth-child(4) .react-select-override__option-label", "Test area");
    } finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionReplyAndSubscribeTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    DiscussionThread thread = createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick("div.button-icon--discussion-action");
      waitForPresent(".icon-bookmark-full");
      logout();
      MockCourseStudent mockCourseStudent = new MockCourseStudent(2l, course1, student.getId(), TestUtilities.createCourseActivity(course1, CourseActivityState.ONGOING));
      mockBuilder.addCourseStudent(workspace.getId(), mockCourseStudent).build();
      mockBuilder.mockLogin(student);
      login();        
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-list__item-header--discussion span");
      waitAndClick(".link--application-list:nth-child(1)");
      addTextToCKEditor("Student checking in.");
      waitAndClick(".env-dialog__actions .button--dialog-execute");
      waitForVisible(".application-list__item--discussion-reply .application-list__item-body p");
      assertText(".application-list__item--discussion-reply .application-list__item-body p", "Student checking in.");
      logout();
      mockBuilder.mockLogin(admin);
      login();
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitForPresent(".react-select-override");
      //selectOption("#discussionAreaSelect", "subs");
      waitAndClick(".react-select-override .react-select-override__control");
      waitAndClick(".react-select-override .react-select-override__menu #react-select-2-option-1");
      waitForPresent(".application-list__item-header--discussion-thread-list");
      waitForVisible(".application-list__item-content-main--discussion .button-icon--discussion-subscription.active");
      waitAndClick(".application-list__item-header--discussion");
      assertText(".application-list__item--discussion-reply .application-list__item-body p", "Student checking in.");
    } finally {
      archiveUserByEmail(student.getEmail());
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionDeleteThreadTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace("Test", "test course for testing", "3", Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      selectFinnishLocale();
      waitAndClick(".application-list__item-header--discussion span");
      waitAndClick(".link--application-list:nth-child(4)");
      waitForVisible(".dialog--delete-area .button--standard-ok");
      waitAndClick(".button--standard-ok");
      waitForNotVisible(".dialog--delete-area");
      waitForVisible(".application-panel__content .application-panel__content-main.loader-empty");
      assertTextIgnoreCase(".application-panel__content .application-panel__content-main.loader-empty .empty span", "Ei viestejä");
    } finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseDiscussionReplyReplyTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace("Test", "test course for testing", "3", Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-list__item-header");
      waitAndClick(".link--application-list:nth-child(1)");
      addTextToCKEditor("Test reply for test.");
      click(".button--dialog-execute");
      waitForVisible(".application-list .application-list__item--discussion-reply");
      waitAndClick(".application-list .application-list__item--discussion-reply .link--application-list:nth-child(1)");
      addTextToCKEditor("Test reply to reply.");
      click(".button--dialog-execute");
      waitForVisible(".application-list__item--discussion-reply-of-reply .application-list__item-body .rich-text>p");
      assertText(".application-list__item--discussion-reply-of-reply .application-list__item-body .rich-text>p", "Test reply to reply.");
    }finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionQuoteTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace("Test", "test course for testing", "3", Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-list__item-header .discussion-category>span");
      waitAndClick(".link--application-list:nth-child(2)");
      addToEndCKEditor("Test with quote.");
      waitAndClick(".button--dialog-execute");
      waitForPresent(".application-list__item--discussion-reply .rich-text blockquote p strong");
      assertText(".application-list__item--discussion-reply .rich-text blockquote p strong", "Admin User");
      assertText(".application-list__item--discussion-reply .rich-text blockquote p:nth-child(2)", "Testing testing daa daa");
      assertText(".application-list__item--discussion-reply .rich-text>p", "Test with quote.");
    } finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionEditTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
    mockBuilder
    .addStaffMember(admin)
    .mockLogin(admin)
    .addCourse(course1)
    .build();
    login();
    Workspace workspace = createWorkspace("Test", "test course for testing", "3", Boolean.TRUE);
    CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), CourseStaffMemberRoleEnum.COURSE_TEACHER);
    mockBuilder
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      selectFinnishLocale();
      waitAndClick(".application-list__item-header .discussion-category>span");
      waitAndClick(".link--application-list:nth-child(3)");
      waitAndClick("input.env-dialog__input--new-discussion-thread-title");
      sendKeys("input.env-dialog__input--new-discussion-thread-title", "ing");
      addToEndCKEditor("ing");
      waitAndClick(".button--dialog-execute");
      waitForVisible(".application-list__title");
      assertText(".application-list__title-main", "Testinging");
      waitForPresent(".application-list__item-content-main .application-list__item-body .rich-text>p");
      assertTextIgnoreCase(".application-list__item-content-main .application-list__item-body .rich-text>p", "Testing testing daa daaing");
      waitForPresent(".application-list__item-edited");
      assertTextStartsWith(".application-list__item-edited", "Muokattu:");
    } finally {
      cleanUpWorkspaceDiscussions();
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
