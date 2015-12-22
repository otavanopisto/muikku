package fi.muikku.ui.base.announcer;

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
      mocker().addStaffMember(admin).mockLogin(admin).build();
      login();
      maximizeWindow();
      navigate("/announcer", true);
      waitAndClick(".bt-mainFunction-content");
      waitForPresent("#endDate");
      clearElement("#endDate");
      sendKeys("#endDate", "21.12.2017");
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
      mocker().addStaffMember(admin).mockLogin(admin).build();
      login();
      maximizeWindow();
      navigate("/announcer", true);
      waitAndClick(".bt-mainFunction-content");
      waitForPresent("#endDate");
      clearElement("#endDate");
      sendKeys("#endDate", "21.12.2017");
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
  public void announcementVisibleFrontpageWidgetTest() throws JsonProcessingException, Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, new DateTime(1990, 2, 2, 0, 0, 0, 0), "121212-1212", Sex.FEMALE);
    mocker().addStaffMember(admin).addStudent(student).mockLogin(admin).build();
    login();
    try{
      maximizeWindow();
      navigate("/announcer", true);
      waitAndClick(".bt-mainFunction-content");
      waitForPresent("#endDate");
      clearElement("#endDate");
      sendKeys("#endDate", "21.12.2017");
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
      logout();
      mocker().mockLogin(student);
      login();
      waitForPresent(".wi-item-topic");
      assertTextIgnoreCase(".wi-item-topic>a", "Test title");
    }finally{
      deleteAnnouncements();
    }
  }
  
  
}
