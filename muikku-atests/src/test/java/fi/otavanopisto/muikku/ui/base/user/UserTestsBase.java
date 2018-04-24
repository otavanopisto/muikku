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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      login();
      waitForPresent(".ordered-container__item--workspaces .text__panel-title");
      String worspaceTitleText = getWebDriver().findElement(By.cssSelector(".ordered-container__item--workspaces .text__panel-title")).getText();
      if(worspaceTitleText.equalsIgnoreCase("Työtilat")) {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        assertTextIgnoreCase(".ordered-container__item--workspaces .text__panel-title", "Workspaces");
      }else {
        waitAndClick(".button-pill--current-language");
        waitForPresent(".dropdown--language-picker");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        waitAndClick("div.dropdown--language-picker div.dropdown__container div:nth-child(2) > a > span");
        waitForPresent(".ordered-container__item--workspaces .text__panel-title");
        assertTextIgnoreCase(".ordered-container__item--workspaces .text__panel-title", "Työtilat");
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void userMenuTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .build();
      
      login();
      navigate("/profile", false);
      waitForPresentAndVisible(".profile-user-realname");
      assertTextIgnoreCase(".profile-user-realname", "admin user");
      waitForPresentAndVisible(".profile-data-wrapper .profile-user-data");
      assertTextIgnoreCase(".profile-data-wrapper .profile-user-data", "admin@example.com");
      assertVisible(".profile-change-password");
      assertVisible("form .profile-basicinfo-section");
      assertVisible("form .profile-basicinfo-section .profile-phone-wrapper>label + input");
      assertVisible("form .profile-vacationinfo-section");
      assertVisible("form .profile-vacationinfo-section .profile-vacation-wrapper .profile-vacation-date>label + input[name=\"profile-vacation-start\"]");
      assertVisible("form .profile-vacationinfo-section .profile-vacation-wrapper .profile-vacation-date>label + input[name=\"profile-vacation-end\"]");
      assertVisible("form .profile-button-wrapper .save-profile-fields");
    }finally {
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void teacherInformationSetAndVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
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
      waitAndSendKeys("form .profile-basicinfo-section .profile-phone-wrapper>label + input", "121212");    
      waitAndSendKeys("form .profile-vacationinfo-section .profile-vacation-wrapper .profile-vacation-date>label + input[name=\"profile-vacation-start\"]", "9.4.2018");
      waitAndSendKeys("form .profile-vacationinfo-section .profile-vacation-wrapper .profile-vacation-date>label + input[name=\"profile-vacation-end\"]", "9.4.2030");
      waitAndClick("form .profile-button-wrapper .save-profile-fields");
      waitForPresentAndVisible(".notification-queue-item-info");
      navigate("/", false);
      logout();
      mockBuilder.mockLogin(student);
      login();
      selectFinnishLocale();
      navigate("/workspace/" + workspace.getUrlName(), false);
      waitForPresentAndVisible(".workspace-teacher-info.phone");
      assertTextIgnoreCase(".workspace-teacher-info.phone", "Puhelin: 121212");
      waitForPresentAndVisible(".workspace-teacher-info.vacation-period");
      assertText(".workspace-teacher-info.vacation-period", "Poissa 9.4.2018 - 9.4.2030"); 
    }finally {
      mockBuilder.wiremockReset();
    }
  }
}
