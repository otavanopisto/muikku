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
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        navigate("/communicator", false);
        waitAndClick("a.button.button--primary-function");
        waitForPresent(".env-dialog__body .autocomplete--new-message input.env-dialog__input");
        sendKeys(".env-dialog__body .autocomplete--new-message input.env-dialog__input", "Test");
        waitAndClick(".autocomplete__recipient");
        waitForPresentAndVisible(".env-dialog__input--new-message-title");
//      TODO: Recipient input hijacks input after first letter. What do?
        sendKeys(".env-dialog__input--new-message-title", "T");
        waitAndClick("#cke_1_contents");
        addTextToCKEditor("Communicator test");
        waitAndClick(".button--dialog-execute");
        waitForNotVisible(".env-dialog__wrapper");
        getWebDriver().get("about:blank");
        navigate("/communicator#sent", false);
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "T");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Admin User");
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "T");
      }finally{
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    } 
  }
  
  @Test
  public void communicatorPagingTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        mockBuilder.mockLogin(student);
        login();        
        navigate("/communicator", false);
        waitForPresentAndVisible("div.message");
        scrollToEnd();
        waitForMoreThanSize("div.message", 30);
        assertCount("div.message", 40);
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test 
  public void communicatorReadMessageTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitAndClick("div.application-list__item.message");
        waitForPresent(".application-list__item-content-header");
        assertText(".application-list__item-content-header", "Test caption");
        waitForPresent(".application-list__item-content-body");
        assertText(".application-list__item-content-body", "Test content.");
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }
  
  @Test
  public void communicatorLatestMessagesIndexWidget() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        mockBuilder.mockLogin(student);
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content-aside .message__select-container input");
        
        waitAndClick(".icon-trash");
        waitForPresent(".application-panel__main-container .empty");
        assertPresent(".application-panel__main-container .empty");
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }

  @Test
  public void communicatorDeleteSentMessageTest() throws Exception {
  MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
      waitAndClick(".application-list__item-content-aside .message__select-container input");
      waitAndClick(".icon-trash");
      
      waitForPresent(".application-panel__main-container .empty");
      String currentUrl = getWebDriver().getCurrentUrl();
      assertPresent(".application-panel__main-container .empty");
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
 
  @Test
  public void communicatorCreateLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        waitForPresent(".application-panel__helper-container a[href^='#label-'] span.item-list__text-body");
        assertText(".application-panel__helper-container a[href^='#label-'] span.item-list__text-body", "Test");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void communicatorAddLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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

        waitAndClick(".application-list__item-content-aside .message__select-container input:first-child");
        waitAndClick(".button-pill--label");
        waitAndClick("a.link--communicator-label-dropdown");
        waitAndClick(".button-pill--label");
        waitForPresentAndVisible(".application-list__item-footer--communicator-message-labels .label__text");
        assertTextIgnoreCase(".application-list__item-footer--communicator-message-labels .label__text", "test");
        
        waitAndClick("div.application-panel__content div.application-panel__helper-container a[href^='#label-']");
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary span", "Student Tester");
        waitForPresent(".application-list__item-body--communicator-message span");
        assertText(".application-list__item-body--communicator-message span", "Another one");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        waitAndClick("div.application-panel__content div.application-panel__helper-container a[href^='#label-'] .icon-pencil");

        waitForPresentAndVisible(".form-element__input--communicator-label-name");
        clearElement(".form-element__input--communicator-label-name");
        sendKeys(".form-element__input--communicator-label-name", "Dun dun duun");
        // TODO: Clicking the guider-share-label button does not seem to work, element is present but click won't go through
        waitAndClick(".button--standard-ok");
        waitForNotVisible(".dialog--communicator");
        waitForPresent("div.application-panel__content div.application-panel__helper-container a[href^='#label-']");
        assertText("div.application-panel__content div.application-panel__helper-container a[href^='#label-'] .item-list__text-body", "Dun dun duun");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
        waitAndClick("div.application-panel__content div.application-panel__helper-container a[href^='#label-'] .icon-pencil");
        waitForPresentAndVisible(".dialog--communicator.dialog--visible");
        waitAndClick(".button--communicator-remove-label");
        assertClassPresent(".button--communicator-remove-label", "disabled");
        // TODO: Clicking the guider-share-label button does not seem to work, element is present but click won't go through
        waitAndClick(".button--standard-ok");
        waitForNotVisible("div.application-panel__content div.application-panel__helper-container a[href^='#label-']");
        assertNotPresent("div.application-panel__content div.application-panel__helper-container a[href^='#label-'] ");
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void communicatorUnlabelMessageLabelTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    try{
      try{
        login();
        long recipient = getUserIdByEmail("admin@example.com");
        long sender = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorMesssage("Another one", "Another content.", sender, recipient);
        navigate("/communicator", false);
        waitAndClick(".button-pill--label");
        waitForPresentAndVisible(".dropdown--communicator-labels input");
        sendKeys(".dropdown--communicator-labels input", "Test");
        waitAndClick(".dropdown--communicator-labels span.link--full");
        waitForPresent("div.application-panel__content div.application-panel__helper-container a[href^='#label-']");
    
        waitAndClick(".application-list__item-content-aside .message__select-container input:first-child");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitAndClick("a.link--communicator-label-dropdown");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitForPresentAndVisible(".application-list__item-footer--communicator-message-labels .label__text");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitAndClick(".dropdown--communicator-labels .dropdown__container .link--communicator-label-dropdown.selected");
        assertGoesAway(".application-list__item-footer--communicator-message-labels .label__text", 5);
      }finally{
        deleteCommunicatorUserLabels(admin.getId());
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void communicatorMoveToTrashTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long recipient = getUserIdByEmail("admin@example.com");
        long sender = getUserIdByEmail("student@example.com");
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content-aside .message__select-container input:first-child");
        
        waitAndClick(".button-pill__icon.icon-trash");
        assertGoesAway(".application-list__item-content-aside .message__select-container input:first-child", 5);
        navigate("/communicator#trash", false);
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Test caption");
      }finally{
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
}