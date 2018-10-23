package fi.otavanopisto.muikku.ui.base.user;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertEquals;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;

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
    try{
      mockBuilder
        .addStaffMember(admin)
        .addStudent(student)
        .mockLogin(admin)
        .build();
      
      login();
      
      createPasswordChange(student.getEmail());
      logout();
      navigate("/forgotpassword/reset?h=testtesttest", false);
      waitForPresent(".username-container");
      assertEquals("test", getAttributeValue(".username-container input", "value"));
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
      waitForPresent(".ordered-container__item--workspaces .ordered-container__item-header-text");
      String worspaceTitleText = getWebDriver().findElement(By.cssSelector(".ordered-container__item--workspaces .ordered-container__item-header-text")).getText();
      if(worspaceTitleText.equalsIgnoreCase("Työtilat")) {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .ordered-container__item-header-text");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .ordered-container__item-header-text");
        assertTextIgnoreCase(".ordered-container__item--workspaces .ordered-container__item-header-text", "Workspaces");
      }else {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .ordered-container__item-header-text");
        assertTextIgnoreCase(".ordered-container__item--workspaces .ordered-container__item-header-text", "Työtilat");
      }
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
      assertVisible(".dropdown__container .icon-user + span");
      assertVisible(".dropdown__container .icon-forgotpassword + span");
      assertVisible(".dropdown__container .icon-helpdesk + span");
      assertVisible(".dropdown__container .icon-signout + span");
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
      waitForPresentAndVisible(".profile-element__title");
      assertTextIgnoreCase(".profile-element__title", "admin user");
      waitForPresentAndVisible(".application-panel__main-container .profile-element__item .profile-user-data");
      assertTextIgnoreCase(".application-panel__main-container .profile-element__item .profile-user-data", "admin@example.com");
      
      assertTextIgnoreCase("div.application-panel__main-container > div > form > div:nth-child(1) > label", "Puhelinnumero");
      assertVisible("div.application-panel__main-container > div > form > div:nth-child(1) > input");

      assertTextIgnoreCase("div.application-panel__main-container > div > form > div:nth-child(2) > label", "Loma alkaa");
      assertVisible("div.application-panel__main-container > div > form > div:nth-child(2) .react-datepicker__input-container input");
      
      assertTextIgnoreCase("div.application-panel__main-container > div > form > div:nth-child(3) > label", "Loma loppuu");
      assertVisible("div.application-panel__main-container > div > form > div:nth-child(3) .react-datepicker__input-container input");
      
      assertTextIgnoreCase("form .button--primary-function-save", "Tallenna");
      assertVisible("form .button--primary-function-save");
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void teacherInformationSetAndVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();   
    Course course1 = new CourseBuilder().name("testcourse").id((long) 6).description("test course for testing").buildCourse();
    try {
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .addStudent(student)
        .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      MockCourseStudent mcs = new MockCourseStudent(2l, course1.getId(), student.getId());
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
      .addCourseStudent(workspace.getId(), mcs)
      .addCourseStaffMember(course1.getId(), courseStaffMember)
      .build();
      navigate("/profile", false);
      
      waitAndSendKeys("div.application-panel__main-container > div > form > div:nth-child(1) > input", "121212");    
      waitAndSendKeys("div.application-panel__main-container > div > form > div:nth-child(2) .react-datepicker__input-container input", "19.04.2018");
      waitAndClick(".profile-element__title");
      waitAndClick("div.application-panel__main-container > div > form > div:nth-child(3) .react-datepicker__input-container input");
      waitAndSendKeys("div.application-panel__main-container > div > form > div:nth-child(3) .react-datepicker__input-container input", "19.04.2030");
      waitAndClick(".profile-element__title");
      click("form .button--primary-function-save");
      click("form .button--primary-function-save");
      waitForPresentAndVisible(".notification-queue__item--success");
      navigate("/", false);
      logout();
      mockBuilder.mockLogin(student);
      login();
      selectFinnishLocale();
      navigate("/workspace/" + workspace.getUrlName(), false);
      waitForPresent(".workspace-frontpage-teachers");
      waitForPresentAndVisible(".workspace-teacher-info.phone");
      assertTextIgnoreCase(".workspace-teacher-info.phone", "Puhelin: 121212");
// TODO: These don't show at all
      waitForPresentAndVisible(".workspace-teacher-info.vacation-period");
      assertText(".workspace-teacher-info.vacation-period", "Poissa 19.4.2018 - 19.4.2030"); 
    }finally {
      mockBuilder.wiremockReset();
    }
  }
}
