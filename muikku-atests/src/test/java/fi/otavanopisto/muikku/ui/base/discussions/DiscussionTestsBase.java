package fi.otavanopisto.muikku.ui.base.discussions;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class DiscussionTestsBase extends AbstractUITest {
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionSendMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        navigate("/discussion", false);
        waitAndClick(".application-panel__helper-container--main-action .button--primary-function");
        waitAndClick("input.env-dialog__input--new-discussion-thread-title");
        sendKeys("input.env-dialog__input--new-discussion-thread-title", "Test title for discussion");
        addTextToCKEditor("Test text for discussion.");
        waitAndClick(".env-dialog__actions .button--dialog-execute");
        waitForPresent(".application-list__title");
        assertText(".application-list__title", "Test title for discussion");
        waitForPresent(".application-list__item-body .rich-text>p");
        assertTextIgnoreCase(".application-list__item-body .rich-text>p", "Test text for discussion.");
      }finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionAdminCreateAreaTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    try{
      navigate("/discussion", false);
      waitAndClick(".application-panel__toolbar .button-pill__icon.icon-plus");
      waitAndSendKeys("input.env-dialog__input--new-discussion-area-name", "Test area");
      waitAndClick(".env-dialog__textarea");
      waitAndSendKeys(".env-dialog__textarea", "Description of test area");
      sleep(1000);
      waitAndClick(".env-dialog__actions .button--dialog-execute");
      waitUntilCountOfElements(".application-panel__toolbar select.form-element__select--toolbar-selector option", 2);
      assertTrue(isInSelection(".application-panel__toolbar select.form-element__select--toolbar-selector", "Test Area"));
    } finally {
      cleanUpDiscussions();
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionReplyTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
          "<p>Testing testing daa daa</p>", false, false);
      try{
        navigate("/discussion", false);
        waitAndClick(".application-list__item-header--discussion span");
        waitAndClick(".link--application-list-item-footer:nth-child(1)");
        addTextToCKEditor("Test reply for test.");
        waitAndClick(".env-dialog__actions .button--dialog-execute");
        waitForVisible(".application-list__item--discussion-reply .application-list__item-body p");
        assertText(".application-list__item--discussion-reply .application-list__item-body p", "Test reply for test.");
    } finally {
      deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
      deleteDiscussion(discussionGroup.getId(), discussion.getId());
    }
  } finally {
    deleteDiscussionGroup(discussionGroup.getId());
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionDeleteThreadTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
          "<p>Testing testing daa daa</p>", false, false);
      try{
        navigate("/discussion", false);
        selectFinnishLocale();
        waitAndClick(".application-list__item-header--discussion span");
        waitAndClick(".link--application-list-item-footer:nth-child(4)");
        waitForVisible(".dialog--delete-area .button--standard-ok");
        waitAndClick(".button--standard-ok");
        waitForNotVisible(".dialog--delete-area");
        waitForVisible(".application-panel__content .application-panel__main-container.loader-empty");
        assertTextIgnoreCase(".application-panel__content .application-panel__main-container.loader-empty .empty span", "Ei viestejä");
    } finally {
      deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
      deleteDiscussion(discussionGroup.getId(), discussion.getId());
    }
  } finally {
    deleteDiscussionGroup(discussionGroup.getId());
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionReplyReplyTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();

    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
        navigate("/discussion", false);
        waitAndClick(".application-list__item-header .discussion-category>span");
        waitAndClick(".link--application-list-item-footer:nth-child(1)");
        addTextToCKEditor("Test reply for test.");
        click(".button--dialog-execute");
        waitForVisible(".application-list .application-list__item--discussion-reply");
        waitAndClick(".application-list .application-list__item--discussion-reply .link--application-list-item-footer:nth-child(1)");
        addTextToCKEditor("Test reply to reply.");
        click(".button--dialog-execute");
        waitForVisible(".application-list__item--discussion-reply-of-reply .application-list__item-body .rich-text>p");
        assertText(".application-list__item--discussion-reply-of-reply .application-list__item-body .rich-text>p", "Test reply to reply.");
        } finally {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        }
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionQuoteTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", false);
          waitAndClick(".application-list__item-header .discussion-category>span");
          waitAndClick(".link--application-list-item-footer:nth-child(2)");
          addToEndCKEditor("Test with quote.");
          waitAndClick(".button--dialog-execute");
          waitForPresent(".application-list__item--discussion-reply .rich-text blockquote p strong");
          assertText(".application-list__item--discussion-reply .rich-text blockquote p strong", "Admin User");
          assertText(".application-list__item--discussion-reply .rich-text blockquote p:nth-child(2)", "Testing testing daa daa");
          assertText(".application-list__item--discussion-reply .rich-text>p", "Test with quote.");
        } finally {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        }
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
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
        TestEnvironments.Browser.SAFARI,
        TestEnvironments.Browser.CHROME_HEADLESS
      }
    )
  public void discussionEditTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(4l, 4l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", false);
          selectFinnishLocale();
          waitAndClick(".application-list__item-header .discussion-category>span");
          waitAndClick(".link--application-list-item-footer:nth-child(3)");
          waitAndClick("input.env-dialog__input--new-discussion-thread-title");
          sendKeys("input.env-dialog__input--new-discussion-thread-title", "ing");
          addToEndCKEditor("ing");
          waitAndClick(".button--dialog-execute");
          waitAndClick(".application-list__item-header .discussion-category");
          waitForVisible(".application-list__title");
          assertText(".application-list__title", "Testinging");
          waitForPresent(".application-list__item-content-main .application-list__item-body .rich-text>p");
          assertTextIgnoreCase(".application-list__item-content-main .application-list__item-body .rich-text>p", "Testing testing daa daaing");
          waitForPresent(".application-list__item-edited");
          assertTextStartsWith(".application-list__item-edited", "Muokattu:");
        } finally {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        }
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
      mockBuilder.wiremockReset();
    }
  }
}