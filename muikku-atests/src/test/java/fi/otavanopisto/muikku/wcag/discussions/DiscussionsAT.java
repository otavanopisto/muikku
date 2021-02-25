package fi.otavanopisto.muikku.wcag.discussions;

import java.io.FileNotFoundException;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class DiscussionsAT extends AbstractWCAGTest{

  @Test
  public void discussionsTest() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/discussion", true);
    waitForVisible(".application-panel--discussion");
    testAccessibility("Discussions view");
    waitAndClick(".application-list__item.message:first-child");
    waitForVisible(".application-list__item--discussion-message");
    testAccessibility("Discussions single thread");
    navigate("/discussion", true);
    waitAndClick(".application-panel__helper-container--discussion a.button--primary-function");
    waitForVisible(".env-dialog__header");
    testAccessibility("Discussions new message");
  }
  
  @Test
  public void discussionsDeleteMessageDialogTest() throws FileNotFoundException {
    login(getTestAdmin(), getTestAdminPassword(), true);
    navigate("/discussion", true);
    waitAndClick(".application-list__item.message:first-child");
    waitAndClick(".application-list__item--discussion-message .link--application-list-item-footer:nth-child(4)");
    waitForVisible(".dialog--delete-area .button--standard-ok");
    testAccessibility("Discussions delete message dialog");

    navigate("/discussion", true);
    waitAndClick(".application-list__item.message:first-child");
    waitAndClick(".application-list__item--discussion-message .link--application-list-item-footer:nth-child(3)");
    waitForVisible(".env-dialog__row--new-discussion-thread-states");
    testAccessibility("Discussions edit message dialog");
    
    navigate("/discussion", true);
    waitAndClick(".application-list__item.message:first-child");
    waitAndClick(".application-list .application-list__item--discussion-message+div.application-list__item--discussion-reply .link--application-list-item-footer:nth-child(4)");
    waitForVisible(".dialog--delete-area .button--standard-ok");
    testAccessibility("Discussions delete message reply dialog");
  }
  
}
