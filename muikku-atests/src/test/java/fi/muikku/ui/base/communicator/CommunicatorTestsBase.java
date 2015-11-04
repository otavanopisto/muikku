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
    sendKeys("#recipientContent", "Test");
    waitAndClick(".ui-autocomplete li.ui-menu-item");
    waitAndClick(".mf-textfield-subject");
    
    waitAndClick("#cke_1_contents");
    getWebDriver().switchTo().activeElement().sendKeys("Communicator test");
    click("*[name='send']");
    waitAndClick("#j_idt64");
    waitForPresent(".index");
    loginStudent1();
//    mockaa
//    http://dev.muikku.fi:8089/users/logout.page?redirectUrl=https://dev.muikku.fi:8443
    navigate("/communicator", true);
    assertText("div.cm-message-header-content-secondary", "Test");
  }
  
  @Test
  public void communicatorSentMessagesTest() throws Exception {
    loginAdmin();
    PyramusMocks.personsPyramusMocks(); 
  }


}