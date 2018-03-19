package fi.otavanopisto.muikku.ui.base.communicator;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.junit.Test;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CommunicatorTestsBase extends AbstractUITest {
  
  @Test
  public void communicatorSendAndReadMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", false);
        waitAndClick("a.button.button--primary-function");
        waitForPresent("div.jumbo-dialog__body > div.autocomplete.autocomplete--new-messsage input.form-field-tag-input__input");
        sendKeys("div.jumbo-dialog__body > div.autocomplete.autocomplete--new-messsage input.form-field-tag-input__input", "Test");
        waitAndClick(".text--recepient-autocomplete");
        waitForPresentAndVisible(".form-field--communicator-new-message-subject");
//      TODO: Recipient input hijacks input after first letter. What do?  
        sendKeys(".form-field--communicator-new-message-subject", "T");
        waitAndClick("#cke_1_contents");
        addTextToCKEditor("Communicator test");
        waitAndClick(".button--standard-ok");
        waitForNotVisible(".jumbo-dialog__wrapper");
        getWebDriver().get("about:blank");
        navigate("/communicator#sent", false);
        waitForPresent(".application-list__item-content--main .text--communicator-body");
        assertText(".application-list__item-content--main .text--communicator-body", "T");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitForPresent("span.text--communicator-username");
        assertText("span.text--communicator-username", "Admin User");
        waitForPresent("span.text--communicator-body");
        assertText("span.text--communicator-body", "T");
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
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = getUserIdByEmail("admin@example.com");
        long recipient = getUserIdByEmail("student@example.com");
        for(int i = 0; i < 40; i++)
          createCommunicatorMesssage("Test " + i, "Test content " + i, sender, recipient);
        logout();
        mockBuilder.mockLogin(student).build();
        login();        
        navigate("/communicator", false);
        waitForPresentAndVisible("div.message");
        scrollToEnd();
        sleep(2000);
        assertTrue(String.format("Elements list is not greater than %d in size", 30), waitForMoreThanSize("div.message", 30)); 
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
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
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
        navigate("/communicator", false);
        waitAndClick("div.application-list__item.message");
        waitForPresent(".text--communicator-message-caption");
        assertText(".text--communicator-message-caption", "Test caption");
        waitForPresent(".text--communicator-message-content");
        assertText(".text--communicator-message-content", "Test content.");
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }
  
  @Test
  public void communicatorLatestMessagesIndexWidget() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
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

        waitForPresent("span.item-list__latest-message-caption");
        assertText("span.item-list__latest-message-caption", "Test caption");
        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String dateText = date.format(formatter);
        waitForPresent("span.item-list__latest-message-date");
        assertText("span.item-list__latest-message-date", dateText);
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
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
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
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content--aside .message__select-container input:first-child");
        
        waitAndClick(".icon-delete");
        waitForPresent(".application-list__item-content--aside");
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".application-list__item-content--aside .message__select-container input:first-child") == false);
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
  MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
  Builder mockBuilder = mocker();
  try{
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    try{
      long sender = getUserIdByEmail("admin@example.com");
      long recipient = getUserIdByEmail("student@example.com");
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      navigate("/communicator#sent", false);
      waitAndClick(".application-list__item-content--aside .message__select-container input:first-child");
      waitAndClick(".icon-delete");
      
      waitForPresent(".application-list__item-content--aside");
      String currentUrl = getWebDriver().getCurrentUrl();
      assertTrue("Communicator does not stay in sent messages box.", currentUrl.equals("http://dev.muikku.fi:" + getPortHttp() + "/communicator#sent"));
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".application-list__item-content--aside .message__select-container input:first-child") == false);      
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
 
  @Test
  public void communicatorCreateLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", false);
        waitAndClick(".button-pill--label");
        waitForPresentAndVisible(".dropdown--communicator-labels input");
        sendKeys(".dropdown--communicator-labels input", "Test");
        waitAndClick(".dropdown--communicator-labels span.link--full");
        waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-'] > span.item-list__text-body.text");
        assertText("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-'] > span.item-list__text-body.text", "Test");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void communicatorAddLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long recipient = getUserIdByEmail("admin@example.com");
        long sender = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorMesssage("Another one", "Another content.", sender, recipient);
        createCommunicatorUserLabel(admin.getId(), "test");
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content--aside .message__select-container input:first-child");
        waitAndClick(".button-pill--label");
        waitAndClick("a.link--communicator-label span.text");
        waitAndClick(".button-pill--label");
        waitForPresentAndVisible(".application-list__item-footer--message .text--label span:nth-child(2)");
        assertTextIgnoreCase(".application-list__item-footer--message .text--label span:nth-child(2)", "test");
        
        waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-']");
        waitForPresent("span.text--communicator-username");
        assertText("span.text--communicator-username", "Student Tester");
        waitForPresent("span.text--communicator-body");
        assertText("span.text--communicator-body", "Another one");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void communicatorEditLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long recipient = getUserIdByEmail("admin@example.com");
        long sender = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorUserLabel(admin.getId(), "test");
        navigate("/communicator", false);
        waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-'] .icon-edit");

        waitForPresentAndVisible(".form-field--label-name");
        clearElement(".form-field--label-name");
        sendKeys(".form-field--label-name", "Dun dun duun");
        waitAndClick(".button--standard-ok");
        waitForNotVisible(".dialog--communicator");
        waitForPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-']");
        assertText("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-'] > span.item-list__text-body.text", "Dun dun duun");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void communicatorDeleteLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long recipient = getUserIdByEmail("admin@example.com");
        long sender = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorUserLabel(admin.getId(), "test");
        navigate("/communicator", false);
        waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-'] .icon-edit");
        waitForPresentAndVisible(".dialog--communicator.dialog--visible");
        waitAndClick(".button--communicator-remove-label");
        assertClassPresent(".button--communicator-remove-label", "disabled");
        waitAndClick(".button--standard-ok");
        waitForNotVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-']");
        assertNotPresent("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > a[href^='#label-']");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
//  @Test
//  public void communicatorMoveToTrashTest() throws Exception {
//    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
//    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
//    Builder mockBuilder = mocker();
//    try{
//      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
//      login();
//      try{
//        long recipient = getUserIdByEmail("admin@example.com");
//        long sender = getUserIdByEmail("student@example.com");
//        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
//        navigate("/communicator#inbox", false);
//        waitAndClick("input[name=\"messageSelect\"]");
//        
//        waitAndClick(".icon-delete");
//        assertGoesAway(".cm-message .cm-message-caption", 10l);
//        waitAndClick("a[href$=\"trash\"]");
//        waitForPresent(".cm-message-header-container .cm-message-caption");
//        assertText(".cm-message-header-container .cm-message-caption", "Test caption");
//      }finally{
//        deleteCommunicatorMessages();
//      }
//    }finally {
//      mockBuilder.wiremockReset();
//    }
//  }
  
}