package fi.otavanopisto.muikku.ui.base.user;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
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
      assertTextIgnoreCase(".panel--workspaces .panel__header-title", "Workspaces");
      selectFinnishLocale();
      waitForPresent(".panel--workspaces .panel__header-title");
      assertTextIgnoreCase(".panel--workspaces .panel__header-title", "Työtilat");
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
      navigate("/profile", false);
      waitForVisible(".profile-element__title");
      assertTextIgnoreCase(".profile-element__title", "admin user");
      waitForVisible(".profile-element__item .profile-element__data");
      assertTextIgnoreCase(".profile-element__item .profile-element__data", "admin@example.com");
      
      assertTextIgnoreCase(".application-panel__main-container .profile-element__item label[for='profilePhoneNumber']", "Puhelinnumero");
      assertVisible(".application-panel__main-container .profile-element__item input#profilePhoneNumber");

      assertTextIgnoreCase(".application-panel__main-container .profile-element__item label[for='profileVacationStart']", "Loma alkaa");
      assertVisible(".application-panel__main-container .profile-element__item input#profileVacationStart");
      
      assertTextIgnoreCase(".application-panel__main-container .profile-element__item label[for='profileVacationEnd']", "Loma loppuu");
      assertVisible(".application-panel__main-container .profile-element__item input#profileVacationEnd");
      
      assertTextIgnoreCase(".application-panel__main-container .profile-element__item label[for='chatVisibility']", "Chatin näkyvyys");
      assertVisible(".application-panel__main-container .profile-element__item select#chatVisibility");

      assertTextIgnoreCase(".application-panel__main-container .profile-element__item label[for='chatNickname']", "Chatin nimimerkki");
      assertVisible(".application-panel__main-container .profile-element__item input#chatNickname");
      
      assertTextIgnoreCase(".application-panel__main-container .profile-element__item .button--primary-function-save", "Tallenna");
      assertVisible(".application-panel__main-container .profile-element__item .button--primary-function-save");
    }finally {
      mockBuilder.wiremockReset();
    }
  }

}
