package fi.muikku.ui.base.communicator;

import static org.junit.Assert.assertTrue;

import org.junit.Test;
import fi.muikku.ui.AbstractUITest;


public class CommunicatorTestsBase extends AbstractUITest {
  
  @Test
  public void communicatorSendMessageTest() throws Exception {
    try{
      loginAdmin();
      navigate("/communicator", true);
      waitAndClick(".bt-mainFunction-content span");
      waitForPresent("#recipientContent");
      sendKeys("#recipientContent", "Test");
      waitAndClick(".ui-autocomplete li.ui-menu-item");
      waitForPresent(".mf-textfield-subject");
      sendKeys(".mf-textfield-subject", "Test");    
      waitAndClick("#cke_1_contents");
      getWebDriver().switchTo().activeElement().sendKeys("Communicator test");
      click("*[name='send']");
      navigate("/communicator", true);
      waitForPresent("div.cm-message-header-content-secondary");
      assertText("div.cm-message-header-content-secondary", "Test");  
    }finally{
      deleteCommunicatorMessages(); 
    }
  }
  
  @Test
  public void communicatorSentMessagesTest() throws Exception {
    try{
      loginAdmin();
      navigate("/communicator", true);
      waitAndClick(".bt-mainFunction-content span");
      waitForPresent("#recipientContent");
      sendKeys("#recipientContent", "Test");
      waitAndClick(".ui-autocomplete li.ui-menu-item");
      waitForPresent(".mf-textfield-subject");
      sendKeys(".mf-textfield-subject", "Test");    
      waitAndClick("#cke_1_contents");
      getWebDriver().switchTo().activeElement().sendKeys("Communicator test");
      click("*[name='send']");
      // Window.reload screws this up.
      // waitForPresentVisible(".notification-queue-item-success span");
//      waitForPresent(".cm-messages-container");
      navigate("/communicator#sent", true);
      waitForPresent("div.cm-message-header-content-secondary");
      assertText("div.cm-message-header-content-secondary", "Test");
    }finally{
      deleteCommunicatorMessages(); 
    }
  }
  
  @Test
  public void communicatorPagingTest() throws Exception {
    try{
      loginAdmin();
      long sender = getUserIdByEmail("admin@made.up");
      long recipient = getUserIdByEmail("testuser@made.up");
      for(int i = 0; i < 30; i++)
        createCommunicatorMesssage("Test " + i, "Test content " + i, sender, recipient);
      logout();
      loginStudent1();
      navigate("/communicator", true);
      waitScrollAndClick(".cm-page-link-load-more");
      assertTrue(String.format("Elements list is not greater than %d in size", 10), waitForMoreThanSize("div.cm-message-header-content-secondary", 10)); 
    }finally{
      deleteCommunicatorMessages(); 
    }
  }
    
  @Test
  public void communicatorReadMessageTest() throws Exception {
    try{
      loginAdmin();
      long sender = getUserIdByEmail("admin@made.up");
      long recipient = getUserIdByEmail("testuser@made.up");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      logout();
      loginStudent1();
      navigate("/communicator", true);
      waitAndClick("div.cm-message-header-content-secondary");
      waitForPresent(".cm-message-content-text");
      assertText("div.cm-message-content-text", "Test content.");
    }finally{
      deleteCommunicatorMessages(); 
    }
  }
  
  @Test
  public void communicatorDeleteInboxMessageTest() throws Exception {
    try{
      loginAdmin();
      long sender = getUserIdByEmail("admin@made.up");
      long recipient = getUserIdByEmail("testuser@made.up");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      logout();
      loginStudent1();
      navigate("/communicator", true);
      waitAndClick("div.mf-item-select input[type=\"checkbox\"]");
      waitAndClick("div.icon-delete");
      // waitForPresentVisible(".notification-queue-item-success");
      waitForPresent(".cm-messages-container");
      assertTrue("Element found even though it shouldn't be there", isElementPresent("div.mf-item-select input[type=\"checkbox\"]") == false);
    }finally{
      deleteCommunicatorMessages(); 
    }
  }

  @Test
  public void communicatorDeleteSentMessageTest() throws Exception {
    try{
      loginAdmin();
      long sender = getUserIdByEmail("admin@made.up");
      long recipient = getUserIdByEmail("testuser@made.up");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      navigate("/communicator#sent", true);
      waitAndClick("div.mf-item-select input[type=\"checkbox\"]");
      waitAndClick("div.icon-delete");
      // waitForPresentVisible(".notification-queue-item-success");
      waitForPresent(".cm-messages-container");
      String currentUrl = getWebDriver().getCurrentUrl();
      assertTrue("Communicator does not stay in sent messages box.", currentUrl.equals("https://dev.muikku.fi:8443/communicator#sent"));
      assertTrue("Element found even though it shouldn't be there", isElementPresent("div.mf-item-select input[type=\"checkbox\"]") == false);
    }finally{
      deleteCommunicatorMessages(); 
    }
  }
  
}