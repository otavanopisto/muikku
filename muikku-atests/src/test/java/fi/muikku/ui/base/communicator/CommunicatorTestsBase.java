package fi.muikku.ui.base.communicator;

import org.junit.Test;

import fi.muikku.ui.AbstractUITest;
import fi.muikku.ui.PyramusMocks;

public class CommunicatorTestsBase extends AbstractUITest {
  
  @Test
  public void communicatorSendMessageTest() throws Exception {
    loginAdmin();
    PyramusMocks.personsPyramusMocks();
    navigate("/communicator", true);
    waitAndClick(".bt-mainFunction-content span");
    waitForPresent("#recipientContent");
    sendKeys("#recipientContent", "Test User");
    waitAndClick(".ui-autocomplete li.ui-menu-item");
    waitForPresent(".mf-textfield-subject");
    sendKeys(".mf-textfield-subject", "Test");    
    waitAndClick("#cke_1_contents");
    getWebDriver().switchTo().activeElement().sendKeys("Communicator test");
    click("*[name='send']");
    logout();
    loginStudent1();
    navigate("/communicator", true);
    waitForPresent("div.cm-message-header-content-secondary");
    assertText("div.cm-message-header-content-secondary", "Test");
//    viestien poisto
  }
  
  @Test
  public void communicatorSentMessagesTest() throws Exception {
    loginAdmin();
    PyramusMocks.personsPyramusMocks();
    navigate("/communicator", true);
    waitAndClick(".bt-mainFunction-content span");
    waitForPresent("#recipientContent");
    sendKeys("#recipientContent", "Test User");
    waitAndClick(".ui-autocomplete li.ui-menu-item");
    waitForPresent(".mf-textfield-subject");
    sendKeys(".mf-textfield-subject", "Test");    
    waitAndClick("#cke_1_contents");
    getWebDriver().switchTo().activeElement().sendKeys("Communicator test");
    click("*[name='send']");
    waitForPresentVisible(".notification-queue-item-success span");
    navigate("/communicator#sent", true);
    waitForPresent("div.cm-message-header-content-secondary");
    assertText("div.cm-message-header-content-secondary", "Test");
//    test cleanup
  }


}