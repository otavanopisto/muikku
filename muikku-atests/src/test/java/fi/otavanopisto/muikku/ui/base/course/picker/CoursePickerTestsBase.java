package fi.otavanopisto.muikku.ui.base.course.picker;

import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.openqa.selenium.By;

import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
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
      Course course1 = new CourseBuilder().name("testcourse adf").id((long) 100).description("test course foraeas testing").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
        waitForVisible(".application-panel__actions-aside");
  //      Course selector
        waitForPresent(".application-panel__actions-aside select > option:nth-child(1)");
        waitForPresent(".application-panel__actions-aside select > option:nth-child(2)");
        waitForPresent(".application-panel__actions-aside select > option:nth-child(3)");
  //      Search field
        waitForVisible(".application-panel__toolbar-actions-main input");
  //      Side navigation
        waitForVisible(".application-panel__content-aside");
  //      Course list and course
//      CoursePicker seems to have a glitch where sometimes no courses are loaded at all. So workaround for that.
        waitForElementToAppear(".application-panel__content-main .application-list__item.course", 10, 5000);
        boolean elementExists = getWebDriver().findElements(By.cssSelector(".application-panel__content-main .application-list__item.course")).size() > 0;
        assertTrue(elementExists);
      }finally{
        deleteWorkspace(workspace.getId());
      }
    }finally {
      mockBuilder.wiremockReset();
    }
  }

  @Test
  public void coursePickerCourseDescriptionTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    try {
      Course course1 = new CourseBuilder().name("testcourse 2").id((long) 101).description("<p>test course for testing</p>").buildCourse();
      mockBuilder
        .addStaffMember(admin)
        .mockLogin(admin)
        .addCourse(course1)
        .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      try {
        navigate("/coursepicker", false);
//      CoursePicker seems to have a glitch where sometimes no courses are loaded at all. So workaround for that.
        waitForElementToAppear(".application-panel__content-main .application-list__item.course", 10, 5000);
        waitForPresent(".application-panel__content-main .application-list__item-header--course .application-list__header-primary");
        waitAndClick(".application-panel__content-main .application-list__item-header--course .application-list__header-primary");
        waitForVisible(".course--open .application-list__item-content-body p");  
        assertText(".course--open .application-list__item-content-body p", "test course for testing");
      }finally {
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
    mockBuilder = mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin);
    List<Course> courses = new ArrayList<>();
    for(Long i = (long) 0; i < 35; i++) {
      Course course = new CourseBuilder()
          .name("Test " + i)
          .id(i)
          .description("Cat herding part #" + i)
          .buildCourse();
      mockBuilder = mockBuilder.addCourse(course);
      courses.add(course);
    }
    mockBuilder.build();
    login();

    List<Workspace> workspaces = new ArrayList<>();
    // This is here to mark the mocked courses as published
    for (Course c : courses) {
      workspaces.add(createWorkspace(c, true));
    }

    try {
      try {
        navigate("/coursepicker", false);
//      CoursePicker seems to have a glitch where sometimes no courses are loaded at all. So workaround for that.
        waitForElementToAppear(".application-panel__content-main .application-list__item.course", 10, 5000);
        waitForVisible(".application-panel__content-main.loader-empty .application-list__item-header--course");
        scrollToEnd();
        waitForMoreThanSize(".application-list__item.course", 27);
        assertCount(".application-list__item.course", 35);
      } finally {
        mockBuilder.wiremockReset();
      }
    } finally {
      for (Workspace w : workspaces) {
        deleteWorkspace(w.getId());
      }
    }
  }
  
  @Test
  public void coursePickerSearchTest() throws Exception {
    Builder mockBuilder = mocker();
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    try{
      Course course1 = new CourseBuilder().name("testcourse").id((long) 102).description("test course for testing").buildCourse();
      Course course2 = new CourseBuilder().name("WIENER course").id((long) 103).description("wiener course for testing").buildCourse();
      Course course3 = new CourseBuilder().name("potato course").id((long) 104).description("potato course for testing").buildCourse();
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
//      CoursePicker seems to have a glitch where sometimes no courses are loaded at all. So workaround for that.
        waitForElementToAppear(".application-panel__content-main .application-list__item.course", 10, 5000);
        waitForVisible(".application-panel__content-main.loader-empty .application-list__item-header--course");
        waitAndSendKeys(".application-panel__toolbar-actions-main input", "pot");
        waitAndSendKeys(".application-panel__toolbar-actions-main input", "ato");
        waitUntilElementCount(".application-list__item-header--course", 1);
        waitForVisible(".application-list__item-header--course .application-list__header-primary");
        assertTextIgnoreCase(".application-list__item-header--course .application-list__header-primary", "potato course (test extension)");
      }finally {
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
      Course course1 = new CourseBuilder().name("testcourse 6").id((long) 105).description("test course for testing").buildCourse();
      Course course2 = new CourseBuilder().name("testcourse 7").id((long) 106).description("wiener course for testing").subjectId((long) 2).primaryEducationSubtypeId(2L).primaryEducationTypeId(2L).buildCourse();
      Course course3 = new CourseBuilder().name("testcourse 8").id((long) 107).description("hilleri course for testing").buildCourse();
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
//      CoursePicker seems to have a glitch where sometimes no courses are loaded at all. So workaround for that.
        waitForElementToAppear(".application-panel__content-main .application-list__item.course", 10, 5000);
        waitForVisible(".application-panel__content-main.loader-empty .application-list__item-header--course");
        waitAndClick(".application-panel__content-aside .menu-wrapper .menu:first-child .menu__item:nth-child(3)");
        waitForVisible(".application-list__item-header--course .application-list__header-primary");
        assertTextIgnoreCase(".application-list__item-header--course .application-list__header-primary", "testcourse 7 (test extension)");
      }finally {
        deleteWorkspace(workspace1.getId());
        deleteWorkspace(workspace2.getId());
        deleteWorkspace(workspace3.getId());        
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

}
