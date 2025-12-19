package fi.otavanopisto.muikku.ui.base.communicator;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

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

//      Signature
        waitAndClick(".icon-cog");
        waitForElementToBeClickable(".link--main-functions-settings-dropdown");
        click(".link--main-functions-settings-dropdown");
        addTextToCKEditor("Best Regards from your teacher.");
        waitAndClick(".button--dialog-execute");
        waitUntilElementGoesAway("#dialog-title-update-signature", 10);        
        
        waitAndClick("a.button.button--primary-function");
        waitForPresent(".env-dialog__body .autocomplete--new-message .tag-input .tag-input__input");
        waitAndClick(".env-dialog__body .autocomplete--new-message .tag-input .tag-input__input");
        sendKeys(".env-dialog__body .autocomplete--new-message .tag-input .tag-input__input", "Test");
        waitAndClick(".autocomplete__recipient");

        waitForVisible(".env-dialog__input--new-message-title");
        waitAndClickWithAction(".env-dialog__input--new-message-title");
        waitUntilElementGoesAway(".autocomplete__list", 5);
        waitAndClickWithAction(".env-dialog__input--new-message-title");
        sendKeys(".env-dialog__input--new-message-title", "Test message");
        
        waitForCKReady();
        addTextToCKEditor("Communicator test");
        waitAndClick(".button--dialog-execute");
        waitForNotVisible(".env-dialog__wrapper");
        getWebDriver().get("about:blank");
        navigate("/communicator#sent", false);
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Test message");
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Admin User");
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Test message");
        
        waitAndClick("div.application-list__item.message");
        waitForPresent(".application-list__item-content-header");
        assertText(".application-list__item-content-header", "Test message");
        waitForPresent(".application-list__item-content-body");
        assertText(".application-list__item-content-body p", "Communicator test");
        assertText(".application-list__item-content-body i.mf-signature", "Best Regards from your teacher.");
      }finally{
        deleteCommunicatorMessages();
      }
    }finally {
      mockBuilder.wiremockReset();
    } 
  }
  
  @Test
  public void communicatorStudentSendsMessageToTeacherTest() throws Exception {
    MockStaffMember teacher = new MockStaffMember(3l, 3l, 1l, "Teacher", "User", UserRole.TEACHER, "221212-1234", "teacher@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(teacher).addStudent(student).mockLogin(student).build();
    try{
      try{
        login();
        navigate("/communicator", false);
        waitAndClick("a.button.button--primary-function");
        waitForPresent(".env-dialog__body .autocomplete--new-message .tag-input .tag-input__input");
        sendKeys(".env-dialog__body .autocomplete--new-message .tag-input .tag-input__input", "Teacher");
        waitAndClick(".autocomplete__recipient");
        waitForVisible(".env-dialog__input--new-message-title");
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
        mockBuilder.mockLogin(teacher);
        login();
        navigate("/communicator", false);
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary>span");
        assertText(".application-list__item-header--communicator-message .application-list__header-primary>span", "Student Tester (Test Study Programme)");
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
        long sender = fetchUserIdByEmail(admin.getEmail());
        long recipient = fetchUserIdByEmail(student.getEmail());

        for(int i = 0; i < 40; i++)
          createCommunicatorMesssage("Test " + i, "Test content " + i, sender, recipient);
        logout();
        mockBuilder.mockLogin(student);
        login();        
        navigate("/communicator", false);
        waitForVisible("div.message");
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
  public void communicatorLatestMessagesIndexWidget() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        long sender = fetchUserIdByEmail(admin.getEmail());
        long recipient = fetchUserIdByEmail(student.getEmail());
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresent("span.item-list__latest-message-caption");
        assertText("span.item-list__latest-message-caption", "Test caption");
        LocalDate date = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d.M.yyyy");
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
        long sender = fetchUserIdByEmail(admin.getEmail());
        long recipient = fetchUserIdByEmail(student.getEmail());
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        
        waitAndClick(".icon-trash");
        waitForPresent(".application-panel__content-main .empty");
        assertPresent(".application-panel__content-main .empty");
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
      long sender = fetchUserIdByEmail(admin.getEmail());
      long recipient = fetchUserIdByEmail(student.getEmail());
      createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
      navigate("/communicator#sent", false);
      waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
      waitAndClick(".icon-trash");
      
      waitForPresent(".application-panel__content-main .empty");
      assertPresent(".application-panel__content-main .empty");
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
        waitForVisible(".dropdown--communicator-labels input");
        sendKeys(".dropdown--communicator-labels input", "Test");
        waitAndClick(".dropdown--communicator-labels .link--full");
        waitForPresent(".application-panel__content-aside a[href^='#label-'] span.menu__item-link-text");
        assertText(".application-panel__content-aside a[href^='#label-'] span.menu__item-link-text", "Test");
      }finally{
        deleteCommunicatorUserLabels(getUserIdByEmail(admin.getEmail()));
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
      long recipient = fetchUserIdByEmail(admin.getEmail());
      long sender = fetchUserIdByEmail(student.getEmail());
      try{
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorUserLabel(recipient, "test");
        sleep(1000);
        createCommunicatorMesssage("Another one", "Another content.", sender, recipient);
        
        navigate("/communicator", false);

        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        waitAndClick(".button-pill--label");
        waitAndClick("a.link--communicator-label-dropdown");
        waitAndClick(".button-pill--label");
        waitForVisible(".application-list__item-footer--communicator-message-labels .label__text");
        assertTextIgnoreCase(".application-list__item-footer--communicator-message-labels .label__text", "test");
        
        waitAndClick(".application-panel__content-aside a[href^='#label-']");
        waitForPresent(".application-list__item-header--communicator-message .application-list__header-primary span");
        waitUntilCountOfElements(".application-list__item-body--communicator-message", 1);
        assertText(".application-list__item-header--communicator-message .application-list__header-primary span", "Student Tester (Test Study Programme)");
        assertText(".application-list__item-body--communicator-message span", "Another one");
      }finally{
        deleteCommunicatorUserLabels(recipient);
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
      long recipient = fetchUserIdByEmail(admin.getEmail());
      long sender = fetchUserIdByEmail(student.getEmail());
      try{
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorUserLabel(recipient, "test");
        navigate("/communicator", false);
        waitAndClick(".application-panel__content-aside .icon-more_vert");
        waitAndClick("#tagDropdownMenu #editOption");
        waitForVisible("#tagCategoryName");
        sleep(500);
        clearElement("#tagCategoryName");
        sendKeys("#tagCategoryName", "Dun dun duun");
        waitAndClick(".button--standard-ok");
        sleep(500);
        waitForPresent(".application-panel__content-aside a[href^='#label-']");
        assertText(".application-panel__content-aside a[href^='#label-'] .menu__item-link-text", "Dun dun duun");
      }finally{
        deleteCommunicatorUserLabels(recipient);
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
      long recipient = fetchUserIdByEmail(admin.getEmail());
      long sender = fetchUserIdByEmail(student.getEmail());
      try{
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorUserLabel(recipient, "test");
        navigate("/communicator", false);
        selectFinnishLocale();
        waitAndClick(".application-panel__content-aside .icon-more_vert");        
        waitAndClick("#tagDropdownMenu #deleteOption");
        waitAndClick(".button--standard-ok");
        waitForNotVisible("div>.dialog>.dialog__window");
        assertNotPresent("div.application-panel__content div.application-panel__helper-container a[href^='#label-']");
      }finally{
        deleteCommunicatorUserLabels(recipient);
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
      long recipient = fetchUserIdByEmail(admin.getEmail());
      long sender = fetchUserIdByEmail(student.getEmail());
      try{
        login();
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        createCommunicatorMesssage("Another one", "Another content.", sender, recipient);
        navigate("/communicator", false);
        waitAndClick(".button-pill--label");
        waitForVisible(".dropdown--communicator-labels input");
        sendKeys(".dropdown--communicator-labels input", "Test");
        waitAndClick(".dropdown--communicator-labels .link--full");
        waitForPresent(".application-panel__content-aside a[href^='#label-']");
    
        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitAndClick("a.link--communicator-label-dropdown");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitForVisible(".application-list__item-footer--communicator-message-labels .label__text");
        sleep(500);
        waitAndClick(".button-pill--label");
        waitAndClick(".dropdown--communicator-labels .dropdown__container .link--communicator-label-dropdown.selected");
        assertGoesAway(".application-list__item-footer--communicator-message-labels .label__text", 5);
      }finally{
        deleteCommunicatorUserLabels(recipient);
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
        long recipient = fetchUserIdByEmail(admin.getEmail());
        long sender = fetchUserIdByEmail(student.getEmail());
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        navigate("/communicator", false);
        waitAndClick(".application-list__item-content-aside .form-element--item-selection-container input");
        
        waitAndClick(".button-pill__icon.icon-trash");
        assertGoesAway(".application-list__item-content-aside .message__select-container .message__selector", 5);
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
  
  @Test 
  public void communicatorStudentReplyToTeacherTest() throws Exception {
    MockStaffMember teacher = new MockStaffMember(5l, 5l, 1l, "Teacher", "User", UserRole.TEACHER, "121212-2334", "teacher@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(teacher).addStudent(student).mockLogin(teacher).build();
      login();
      try{
        long sender = fetchUserIdByEmail(teacher.getEmail());
        long recipient = fetchUserIdByEmail(student.getEmail());
        createCommunicatorMesssage("Test caption", "Test content.", sender, recipient);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/communicator", false);
        waitAndClick("div.application-list__item.message");
        waitForPresent(".application-list__item-content-header");
        waitAndClick(".application-list__item-footer a:first-child");
        
        waitAndClick("#cke_1_contents");
        addTextToCKEditor("Communicator reply test");
        waitAndClick(".button--dialog-execute");
        waitForNotVisible(".env-dialog__wrapper");
        getWebDriver().get("about:blank");
        navigate("/communicator#sent", false);
        waitForPresent(".application-list__item-body--communicator-message .application-list__header-item-body");
        assertText(".application-list__item-body--communicator-message .application-list__header-item-body", "Vs: Test caption");
        
      }finally{
        deleteCommunicatorMessages(); 
      }
    }finally {
      mockBuilder.wiremockReset();
    }  
  }

}