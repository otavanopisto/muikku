package fi.otavanopisto.muikku.ui.base.user;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class UserTestsBase extends AbstractUITest {

  @Test
  public void usernameVisibleInResetPasswordViewTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    
    try{
      createPasswordChange(student.getEmail());
      logout();
      mockBuilder.clearLoginMock().mockResetCredentials("test").mockResetCredentialsPost();
      navigate("/forgotpassword/reset?h=testtesttest", false);
      waitForPresent(".form-element--forgot-password:first-child input");
      assertEquals("test", getAttributeValue(".form-element--forgot-password:first-child input", "value"));
    }finally {
      deletePasswordChange(student.getEmail());
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void changeLocaleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      login();
      selectEnglishLocale();
      waitForPresent(".panel--workspaces .panel__header-title");
      assertTextIgnoreCase(".panel--workspaces .panel__header-title", "Courses");
      selectFinnishLocale();
      waitForPresent(".panel--workspaces .panel__header-title");
      assertTextIgnoreCase(".panel--workspaces .panel__header-title", "Kurssit");
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void userMenuTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      login();
      selectFinnishLocale();
      waitAndClick(".button-pill--profile");
      waitForVisible(".dropdown__container .icon-user + span");
      assertVisible(".dropdown__container .icon-user + span");
      assertVisible(".dropdown__container .icon-question + span");
      assertVisible(".dropdown__container .icon-support+ span");
      assertVisible(".dropdown__container .icon-sign-out + span");
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void profileTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      login();
      selectFinnishLocale();
      navigate("/profile#contact", false);
      waitForVisible(".application-panel__header-title");
      assertTextIgnoreCase(".application-panel__header-title", "admin user");
      waitForVisible(".application-sub-panel__item .application-sub-panel__item-data span");
      assertTextIgnoreCase(".application-sub-panel__item .application-sub-panel__item-data span", "admin@example.com");
      
      assertTextIgnoreCase(".form .form__row .form-element label[for='profilePhoneNumber']", "Puhelinnumero");
      assertVisible(".form .form__row .form-element input#profilePhoneNumber");

      assertTextIgnoreCase(".form .form__buttons .button--primary-function-save", "Tallenna");
      assertVisible(".form .form__buttons .button--primary-function-save");
    }finally {
      mockBuilder.wiremockReset();
    }
  }

}
