package fi.muikku.ui.base.announcer;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.muikku.mock.model.MockStaffMember;
import fi.muikku.mock.model.MockStudent;
import fi.muikku.ui.AbstractUITest;
import fi.pyramus.rest.model.Sex;
import fi.pyramus.rest.model.UserRole;
import fi.muikku.mock.PyramusMock.Builder;
import static fi.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

public class AnnouncerTestsBase extends AbstractUITest {

  @Test
  public void createAnnouncementTest() throws JsonProcessingException, Exception {
    try{
      MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
      Builder mockBuilder = mocker();
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      maximizeWindow();
      navigate("/announcer", true);
      waitAndClick(".bt-mainFunction-content");
      waitForPresent("#endDate");
      clearElement("#endDate");
      sendKeys("#endDate", "21.12.2025");
      sendKeys(".mf-textfield-subject", "Test title");
      click(".mf-form-header");
      waitForNotVisible("#ui-datepicker-div");
      switchToFrame(".cke_wysiwyg_frame");
      sendKeys(".cke_editable", "Announcer test announcement");
      switchToDefaultFrame();
      waitAndClick(".mf-toolbar input[name='send']");
      waitForPresent(".an-announcement");
      reloadCurrentPage();
      waitForPresent(".an-announcement");
      assertTextIgnoreCase(".an-announcement-topic>span", "Test title");
      assertTextIgnoreCase(".an-announcement-content>p", "Announcer test announcement"); 
    }finally{
      deleteAnnouncements();
    }
  }
  
  @Test
  public void deleteAnnouncementTest() throws JsonProcessingException, Exception {
    try{
      MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
      Builder mockBuilder = mocker();
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      maximizeWindow();
      navigate("/announcer", true);
      waitAndClick(".bt-mainFunction-content");
      waitForPresent("#endDate");
      clearElement("#endDate");
      sendKeys("#endDate", "21.12.2025");
      sendKeys(".mf-textfield-subject", "Test title");
      click(".mf-form-header");
      waitForNotVisible("#ui-datepicker-div");
      switchToFrame(".cke_wysiwyg_frame");
      sendKeys(".cke_editable", "Announcer test announcement");
      switchToDefaultFrame();
      waitAndClick(".mf-toolbar input[name='send']");
      waitForPresent(".an-announcement");
      assertTextIgnoreCase(".an-announcement-topic>span", "Test title");
      waitAndClick(".an-announcement-select input");
      waitAndClick(".mf-items-toolbar .icon-delete");
      waitAndClick(".mf-toolbar input[name='send']");
      reloadCurrentPage();
      assertTrue("Element found even though it shouldn't be there", isElementPresent(".an-announcement-topic>span") == false);
    }finally{
      deleteAnnouncements();
    }
  }
  
  @Test
  public void announcementVisibleInFrontpageWidgetTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresent(".wi-item-topic");
        assertTextIgnoreCase(".wi-item-topic>a", "Test title");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.reset();
    }
  }

  @SuppressWarnings("deprecation")
  @Test
  public void announcementListTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      login();
      try{
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, true, null);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresent(".wi-item-topic");
        assertTextIgnoreCase(".wi-item-topic>a", "Test title");
        navigate("/announcements", true);
        waitForPresent("#announcementContextNavigation .gc-navigation-item");
        assertTextIgnoreCase("#announcementContextNavigation .gc-navigation-item a", "Test title");
        click("#announcementContextNavigation .gc-navigation-item a");
        waitForPresent(".announcement-article h2");
        assertTextIgnoreCase(".announcement-article h2", "Test title");
        assertTextIgnoreCase(".announcement-article div.article-datetime", "11/12/15");
        assertTextIgnoreCase(".announcement-article div.article-context", "announcer test announcement");
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.reset();
    }
  }

  @Test
  public void userGroupAnnouncementVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, "Test group", "Test group for users", 1l, false).addStudentToStudentGroup(2l, student).addStaffMemberToStudentGroup(2l, admin).mockLogin(admin).build();
      login();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, false, userGroups);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresent(".wi-item-topic");
        assertTextIgnoreCase(".wi-item-topic>a", "Test title");
      }finally{
        deleteAnnouncements();
        deleteUserGroup(2l);
      }
    }finally {
      mockBuilder.reset();
    }
  }
  
  @Test
  public void userGroupAnnouncementNotVisibleTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).addStudentGroup(2l, "Test group", "Test group for users", 1l, false).addStaffMemberToStudentGroup(2l, admin).mockLogin(admin).build();
      login();
      try{
        List<Long> userGroups = new ArrayList<>();
        userGroups.add(2l);
        createAnnouncement(admin.getId(), "Test title", "Announcer test announcement", new Date(115, 10, 12), new Date(125, 10, 12), false, false, userGroups);
        logout();
        mockBuilder.mockLogin(student);
        login();
        waitForPresent(".wi-announcements");
        assertTrue("Element found even though it shouldn't be there", isElementPresent(".wi-item-topic>a") == false);
      }finally{
        deleteAnnouncements();
      }
    }finally {
      mockBuilder.reset();
    }
  }
  
}
