package fi.otavanopisto.muikku.wcag.discussions;

import java.io.FileNotFoundException;

import org.junit.Test;

import fi.otavanopisto.muikku.wcag.AbstractWCAGTest;

public class DiscussionsAT extends AbstractWCAGTest{

  @Test
  public void discussionsTests() throws FileNotFoundException {
    login(getTestStudent(), getTestStudentPassword(), true);
    navigate("/discussion", true);
    waitForVisible(".application-panel__content .loader-empty .application-list__content");
    testAccessibility("Discussions main view");
    
    waitAndClick(".application-list__item.message:first-child");
    waitForVisible(".application-list__item--discussion-message");
    testAccessibility("Discussions single thread");
    
    navigate("/discussion", true);
    waitAndClick(".application-panel__actions-aside .button--primary-function");
    waitForVisible(".env-dialog__body");
    testAccessibility("Discussions new message");
  }
  
  @Test
  public void discussionsDialogTests() throws FileNotFoundException {
    login(getTestAdmin(), getTestAdminPassword(), true);
    navigate("/discussion", true);
    waitAndClick(".application-list__item.message:first-child");
    waitAndClick(".application-list__item-footer--discussion-message > a:nth-child(4)");
    waitForVisible(".dialog--delete-area .button--standard-ok");
    testAccessibility("Discussions delete message dialog");

    navigate("/discussion", true);
    waitAndClick(".application-list__item.message:first-child");
    waitAndClick(".application-list__item-footer--discussion-message > a:nth-child(3)");
    waitForVisible(".env-dialog__body");
    testAccessibility("Discussions edit message dialog");
  }
  
}
