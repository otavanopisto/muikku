package fi.otavanopisto.muikku.ui.base.course.picker;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.muikku.ui.PyramusMocks;

import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  public void coursePickerExistsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action");
//      Course selector
        waitForPresent("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action > select > option:nth-child(1)");
        waitForPresent("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action > select > option:nth-child(2)");
        waitForPresent("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action > select > option:nth-child(3)");
//      Search field
        waitForPresentAndVisible("div.application-panel__actions > div.application-panel__main-container.application-panel__main-container--actions > div > div > input");
//      Side navigation
        waitForPresentAndVisible("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container");
//      Course list and course
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        boolean elementExists = getWebDriver().findElements(By.cssSelector("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course")).size() > 0;
        assertTrue(elementExists);
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void coursePickerCourseDescriptionTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        waitAndClick("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        assertText("div.application-list__item-body.application-list__item-body--course > article", "test course for testing");
      } finally {
        deleteWorkspace(workspace.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
//  @Test
//  public void coursePickerLoadMoreTest() throws Exception {
//    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
//    Builder mockBuilder = mocker();
//    try{
//      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
//      login();
//      List<Workspace> workspaces = new ArrayList<>();
//      for(Long i = (long) 0; i < 30; i++)
//        workspaces.add(createWorkspace("testcourse: " + i.toString(), "test course for testing " + i.toString(), i.toString(), Boolean.TRUE));
//      try {
//        navigate("/coursepicker", false);
//        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
////        waitAndClick("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
//        waitForMoreThanSize(".cp-course", 24);
//        assertCount(".cp-course", 25);
//        waitForPresent(".mf-paging-tool");
//        scrollIntoView(".mf-paging-tool");
//        waitAndClick(".mf-paging-tool");
//        waitForMoreThanSize(".cp-course", 25);
//        assertCount(".cp-course", 30);
//      } finally {
//        for(Workspace w : workspaces) {
//          deleteWorkspace(w.getId());        
//        }
//      }
//    }finally{
//      mockBuilder.wiremockReset();
//    }
//  }
  
  @Test
  public void coursePickerSearchTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      Workspace workspace1 = createWorkspace("testcourse", "test course for testing", "1", Boolean.TRUE);
      Workspace workspace2 = createWorkspace("wiener course", "wiener course for testing", "2", Boolean.TRUE);
      Workspace workspace3 = createWorkspace("potato course", "potato course for testing", "3", Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");        
        waitAndSendKeys("div.application-panel__actions > div.application-panel__main-container.application-panel__main-container--actions > div > div > input", "pot");
        waitAndSendKeys("div.application-panel__actions > div.application-panel__main-container.application-panel__main-container--actions > div > div > input", "ato");
        waitUntilElementCount("div.application-list__item-header.application-list__item-header--course > span.text.text--coursepicker-course-name", 1);
        sleep(1000);
        waitForPresentAndVisible("div.application-list__item-header.application-list__item-header--course > span.text.text--coursepicker-course-name");
        assertTextIgnoreCase("div.application-list__item-header.application-list__item-header--course > span.text.text--coursepicker-course-name", "potato course");
      } finally {
        deleteWorkspace(workspace1.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace3.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
}
