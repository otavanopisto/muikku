package fi.otavanopisto.muikku.ui.base.course.picker;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.openqa.selenium.By;

import com.github.tomakehurst.wiremock.client.WireMock;
import com.thoughtworks.selenium.webdriven.commands.Refresh;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.muikku.ui.PyramusMocks;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.EducationType;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.Subject;
import fi.otavanopisto.pyramus.rest.model.UserRole;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  public void coursePickerExistsTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    
    try{
      Course course1 = new CourseBuilder().name("testcourse adf").id((long) 1).description("test course foraeas testing").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action");
//      Course selector
//        refresh();
        waitForPresent(".application-panel__helper-container--main-action select > option:nth-child(1)");
        waitForPresent(".application-panel__helper-container--main-action select > option:nth-child(2)");
        waitForPresent(".application-panel__helper-container--main-action select > option:nth-child(3)");
//      Search field
        waitForPresentAndVisible(".application-panel__toolbar-actions-main input");
//      Side navigation
        waitForPresentAndVisible(".application-panel__helper-container");
//      Course list and course
        waitForPresentAndVisible(".application-panel__main-container .application-list__item.course");
        boolean elementExists = getWebDriver().findElements(By.cssSelector(".application-panel__main-container .application-list__item.course")).size() > 0;
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
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    try{;
      Course course1 = new CourseBuilder().name("testcourse 2").id((long) 2).description("test course for testing").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action");
//        refresh();
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
  
  @Test
  public void coursePickerLoadMoreTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try{
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      List<Workspace> workspaces = new ArrayList<>();
      for(Long i = (long) 0; i < 35; i++)
        workspaces.add(createWorkspace("testcourse: " + i.toString(), "test course for testing " + i.toString(), i.toString(), Boolean.TRUE));
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        scrollToEnd();
        waitForMoreThanSize(".application-list__item.course", 27);
        assertCount(".application-list__item.course", 35);
      } finally {
        for(Workspace w : workspaces) {
          deleteWorkspace(w.getId());        
        }
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  public void coursePickerSearchTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);

    try{
      Course course1 = new CourseBuilder().name("testcourse hurhur").id((long) 3).description("test course for testing").buildCourse();
      Course course2 = new CourseBuilder().name("WIENER course").id((long) 4).description("wiener course for testing").buildCourse();
      Course course3 = new CourseBuilder().name("potato course").id((long) 5).description("potato course for testing").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .addCourse(course2)
        .addCourse(course3)
        .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
      Workspace workspace3 = createWorkspace(course3, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course"); 
        refresh();
        waitAndSendKeys(".application-panel__toolbar-actions-main input", "pot");
        waitAndSendKeys(".application-panel__toolbar-actions-main input", "ato");
        waitUntilElementCount(".application-list__item-header--course", 1);
        waitForPresentAndVisible(".application-list__item-header--course .application-list__header-primary");
        assertTextIgnoreCase(".application-list__item-header--course .application-list__header-primary", "potato course (test extension)");
      } finally {
        deleteWorkspace(workspace1.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace3.getId());
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void coursePickerEducationTypeFilterTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);

    try{
      mockBuilder.addEducationType(new EducationType((long) 2, "Highschool", "HS", false)).addSubject(new Subject((long) 2, "tc_12", "Test subject", (long) 2, false));
      Course course1 = new CourseBuilder().name("testcourse 6").id((long) 6).description("test course for testing").buildCourse();
      Course course2 = new CourseBuilder().name("testcourse 7").id((long) 7).description("wiener course for testing").subjectId((long) 2).buildCourse();
      Course course3 = new CourseBuilder().name("testcourse 8").id((long) 8).description("potato course for testing").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .addCourse(course2)
        .addCourse(course3)
        .build();
      login();
      Workspace workspace1 = createWorkspace(course1, Boolean.TRUE);
      Workspace workspace2 = createWorkspace(course2, Boolean.TRUE);
      Workspace workspace3 = createWorkspace(course3, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        waitAndClick("div.application-panel__body > div.application-panel__content > div.application-panel__helper-container > div > div:nth-child(1) > a:nth-child(3)");
        waitForPresentAndVisible(".application-list__item-header--course .application-list__header-primary");
        assertTextIgnoreCase(".application-list__item-header--course .application-list__header-primary", "testcourse 7 (test extension)");
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
