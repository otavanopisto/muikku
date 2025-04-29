package fi.otavanopisto.muikku.ui.base.course.discussions;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

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
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CourseDiscussionTestsBase extends AbstractUITest {
  
  @Test
  public void courseDiscussionSendMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
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
      deleteWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), discussion.getId());
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionStudentCreateMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
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
      deleteWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), discussion.getId());
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionAdminCreateAreaTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();    
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
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
      waitUntilCountOfElements(".application-panel__toolbar .react-select-override .react-select-override__menu .react-select-override__option", 3);
      assertText(".application-panel__toolbar .react-select-override .react-select-override__menu .react-select-override__option:nth-child(3) .react-select-override__option-label", "Test area");
    } finally {
      deleteWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), discussion.getId());
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionReplyAndSubscribeTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Course course1 = new CourseBuilder().name("testcourse").id((long) 1).description("test course for testing").buildCourse();
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).addCourse(course1).build();
    login();
    
    Workspace workspace = createWorkspace(course1, Boolean.TRUE);
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
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void courseDiscussionDeleteThreadTest() throws Exception {
    Long courseId = 1l;
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourses", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
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
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void courseDiscussionReplyReplyTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
    DiscussionGroup discussionGroup = createWorkspaceDiscussionGroup(workspace.getId(), "test group");
    Discussion discussion = createWorkspaceDiscussion(workspace.getId(), discussionGroup.getId(), "test discussion");
    createWorkspaceDiscussionThread(workspace.getId(), discussionGroup.getId(), discussion.getId(), "Testing", "<p>Testing testing daa daa</p>", false, false);
    try {
      navigate(String.format("/workspace/%s/discussions", workspace.getName()), false);
      waitAndClick(".application-list__item-header .discussion-category>span");
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
      cleanUpWorkspaceDiscussions(workspace.getId());
      deleteWorkspace(workspace.getId());
      mockBuilder.wiremockReset();
    }
  }
  
}
