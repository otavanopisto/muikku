package fi.muikku.ui.base.announcer;

import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;

import fi.muikku.mock.model.MockStaffMember;
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
      click(".mf-textfield-title");
      sendKeys(".mf-textfield-subject", "Test title");
      waitAndClick(".cke_contents");
      getWebDriver().switchTo().activeElement().sendKeys("Announcer test announcement");
      click("*[name='send']");
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
      click(".mf-textfield-title");
      sendKeys(".mf-textfield-subject", "Test title");
      waitAndClick(".cke_contents");
      getWebDriver().switchTo().activeElement().sendKeys("Announcer test announcement");
      click("*[name='send']");
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
  
}
