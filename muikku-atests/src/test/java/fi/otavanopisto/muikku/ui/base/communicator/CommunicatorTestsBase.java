package fi.otavanopisto.muikku.ui.base.communicator;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;


public class CommunicatorTestsBase extends AbstractUITest {
  
  @Test
  public void communicatorSendMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", true);
        waitAndClick(".mf-primary-function .mf-primary-function-content");
        waitForPresent("#recipientContent");
        sendKeys("#recipientContent", "Test");
        waitAndClick(".ui-autocomplete li.ui-menu-item");
        waitForPresent(".mf-textfield-subject");
        sendKeys(".mf-textfield-subject", "Test");    
        waitAndClick("#cke_1_contents");
        addTextToCKEditor("Communicator test");
        click("*[name='send']");
        waitForPresent(".mf-content-master");
        navigate("/communicator#sent", true);
        waitForPresent(".cm-message-header-content-secondary");
        assertText(".cm-message-header-content-secondary", "Test");  
      }finally{
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    } 
  }
  
  @Test
  public void communicatorSentMessagesTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", true);
        waitAndClick(".mf-primary-function .mf-primary-function-content");
        waitForPresent("#recipientContent");
        sendKeys("#recipientContent", "Test");
        waitAndClick(".ui-autocomplete li.ui-menu-item");
        waitForPresent(".mf-textfield-subject");
        sendKeys(".mf-textfield-subject", "Test");    
        waitAndClick("#cke_1_contents");
        addTextToCKEditor("Communicator test");
        click("*[name='send']");
        waitForPresent(".mf-content-master");
        navigate("/communicator#sent", true);
        waitForPresent(".cm-message-header-content-secondary");
        assertText(".cm-message-header-content-secondary", "Test");  
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    } 
  }
  
  @Test
  public void communicatorPagingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        for(int i = 0; i < 30; i++)
          createCommunicatorMesssage("Test " + i, "Test content " + i, sender, recipient);
        logout();
        mockBuilder.mockLogin(student).build();
        login();        
        navigate("/communicator", true);
        waitScrollAndClick(".cm-page-link-load-more");
        assertTrue(String.format("Elements list is not greater than %d in size", 10), waitForMoreThanSize("div.cm-message-header-content-secondary", 10)); 
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
    
  @Test
  public void communicatorReadMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        logout();
        mockBuilder.mockLogin(student).build();
        login();
        navigate("/communicator", true);
        waitAndClick("div.cm-message-header-content-secondary");
        waitForPresent(".cm-message-content-text");
        assertText("div.cm-message-content-text", "Test content.");
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }
  
  @Test
  public void communicatorDeleteInboxMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        logout();
        mockBuilder.mockLogin(student).build();
        login();
        navigate("/communicator", true);
        waitAndClick("div.cm-message-select input[type=\"checkbox\"]");
        waitAndClick(".icon-delete");
        // waitForPresentVisible(".notification-queue-item-success");
        waitForPresent(".cm-messages-container");
        assertTrue("Element found even though it shouldn't be there", isElementPresent("div.mf-item-select input[type=\"checkbox\"]") == false);
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }

  @Test
  public void communicatorDeleteSentMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        navigate("/communicator#sent", true);
        waitAndClick("div.cm-message-select input[type=\"checkbox\"]");
        waitAndClick("div.icon-delete");
        // waitForPresentVisible(".notification-queue-item-success");
        waitForPresent(".cm-messages-container");
        String currentUrl = getWebDriver().getCurrentUrl();
        assertTrue("Communicator does not stay in sent messages box.", currentUrl.equals("https://dev.muikku.fi:8443/communicator#sent"));
        assertTrue("Element found even though it shouldn't be there", isElementPresent("div.cm-message-select input[type=\"checkbox\"]") == false);
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
}