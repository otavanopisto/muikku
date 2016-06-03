package fi.otavanopisto.muikku.ui.base.discussion;

import org.junit.Test;

import fi.otavanopisto.muikku.atests.Discussion;
import fi.otavanopisto.muikku.atests.DiscussionGroup;
import fi.otavanopisto.muikku.atests.DiscussionThread;
import fi.otavanopisto.muikku.ui.AbstractUITest;

public class DiscussionTestsBase extends AbstractUITest {
  
  @Test
  public void courseDiscussionSendMessageTest() throws Exception {
    loginAdmin();
    
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        navigate("/discussion", true);
        waitAndClick(".di-new-message-button");
        waitAndClick(".mf-textfield-subcontainer input");
        sendKeys(".mf-textfield-subcontainer input", "Test title for discussion");
        addTextToCKEditor("Test text for discussion.");
        click("*[name='send']");
        waitForPresent(".di-message-meta-content>span>p");
        assertText(".di-message-meta-content>span>p", "Test text for discussion.");
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
    }

  }
  
  @Test
  public void courseDiscussionAdminCreateAreaTest() throws Exception {
    loginAdmin();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        navigate("/discussion", true);
        waitAndClick(".sm-flex-hide .di-new-area-button");
        waitAndSendKeys(".mf-textfield input", "Test area");
        click("*[name='send']");
        waitForPresent("#discussionAreaSelect option:nth-child(2)");
        assertText("#discussionAreaSelect option:nth-child(2)", "Test area");
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
    }

  }
  
  @Test
  public void courseDiscussionReplyTest() throws Exception {
    loginAdmin();

    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", true);
          waitAndClick(".di-message-meta-topic>span");
          waitAndClick(".di-message-reply-link");
          addTextToCKEditor("Test reply for test.");
          click("*[name='send']");
          waitForPresent(".di-replies-container .mf-item-content-text p");
          assertText(".di-replies-container .mf-item-content-text p", "Test reply for test.");
        } finally {
          deleteDiscussionThread(discussionGroup.getId(), discussion.getId(), thread.getId());
        }
      } finally {
        deleteDiscussion(discussionGroup.getId(), discussion.getId());
      }
    } finally {
      deleteDiscussionGroup(discussionGroup.getId());
    }
  }
  
  @Test
  public void courseDiscussionDeleteThreadTest() throws Exception {
    loginAdmin();
    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", true);
          waitAndClick(".di-message-meta-topic>span");
          waitAndClick(".di-remove-thread-link");
          waitAndClick(".delete-button>span");
          waitForPresent(".mf-content-empty>h3");
          assertNotPresent(".di-threads .di-message");
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
    }

  }

  @Test
  public void courseDiscussionReplyReplyTest() throws Exception {
    loginAdmin();

    DiscussionGroup discussionGroup = createDiscussionGroup("test group");
    try {
      Discussion discussion = createDiscussion(discussionGroup.getId(), "test discussion");
      try {
        DiscussionThread thread = createDiscussionThread(discussionGroup.getId(), discussion.getId(), "Testing",
            "<p>Testing testing daa daa</p>", false, false);
        try {
          navigate("/discussion", true);
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
    }
  }
  
}