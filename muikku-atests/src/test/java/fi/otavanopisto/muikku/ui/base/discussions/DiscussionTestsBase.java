package fi.otavanopisto.muikku.ui.base.discussions;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.Test;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;

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
    MockStaffMember admin = new MockStaffMember(4l, 4l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      createDiscussion(discussionGroup.getId(), "test discussion");
      navigate("/discussion", false);
      waitAndClick(".application-panel__helper-container--main-action .button--primary-function");
      waitAndClick("input.form-field--new-discussion-thread-title");
      sendKeys("input.form-field--new-discussion-thread-title", "Test title for discussion");
      addTextToCKEditor("Test text for discussion.");
      click("a.button--standard-ok");
      waitForPresent("h3.text--discussion-current-thread-title");
      assertText("h3.text--discussion-current-thread-title", "Test title for discussion");
      waitForPresent(".text--item-article p");
      assertTextIgnoreCase(".text--item-article p", "Test text for discussion.");
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
  public void discussionAdminCreateAreaTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    try{
      navigate("/discussion", false);
      waitAndClick(".application-panel__toolbar .button-pill__icon.icon-add");
      waitAndSendKeys("input.form-field--new-discussion-area-name", "Test area");
      waitAndClick(".form-field--new-discussion-area-description");
      waitAndSendKeys(".form-field--new-discussion-area-description", "Description of test area");
      click(".button--standard-ok");
      waitForPresent(".application-panel__toolbar select.form-field--toolbar-selector option:nth-child(2)");
      assertTextIgnoreCase(".application-panel__toolbar select.form-field--toolbar-selector option:nth-child(2)", "Test area");
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
    MockStaffMember admin = new MockStaffMember(4l, 4l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    login();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
          "<p>Testing testing daa daa</p>", false, false);

      navigate("/discussion", false);
      waitAndClick(".message__title--category-1 ");
      waitAndClick(".link--application-list-item-footer:nth-child(1)");
      addTextToCKEditor("Test reply for test.");
      click(".button--standard-ok");
      waitForPresent(".application-list__item--discussion-reply .application-list__item__body article p");
      assertText(".application-list__item--discussion-reply .application-list__item__body article p", "Test reply for test.");
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
        TestEnvironments.Browser.SAFARI
      }
    )
  public void discussionDeleteThreadTest() throws Exception {
    loginAdmin();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", false);
          waitAndClick(".di-message-meta-topic>span");
          waitAndClick(".di-remove-thread-link");
          waitAndClick(".delete-button>span");
          waitForPresent(".mf-content-empty>h3");
          assertNotPresent(".di-threads .di-message");
        } catch (Exception e) {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
      WireMock.reset();
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
  public void discussionReplyReplyTest() throws Exception {
    loginAdmin();

    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", false);
          waitAndClick(".di-message-meta-topic>span");
          waitAndClick(".di-message-reply-link");
          addTextToCKEditor("Test reply for test.");
          click("*[name='send']");
          waitForPresent(".di-replies-container .mf-item-content-text p");
          waitAndClick(".di-replies-page .di-reply-answer-link>span");
          addTextToCKEditor("Test reply reply for test.");
          click("*[name='send']");
          waitForPresent(".di-replies-container .di-reply-reply .mf-item-content-text p");
          assertText(".di-replies-container .di-reply-reply .mf-item-content-text p", "Test reply reply for test.");
        } catch (Exception e) {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        } finally {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        }
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
      WireMock.reset();
    }
  }
  
}