package fi.otavanopisto.muikku.ui.base.course.management;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.put;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static fi.otavanopisto.muikku.mock.PyramusMock.mocker;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.junit.Test;
import org.openqa.selenium.Keys;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

import fi.otavanopisto.muikku.TestEnvironments;
import fi.otavanopisto.muikku.TestUtilities;
import fi.otavanopisto.muikku.atests.Workspace;
import fi.otavanopisto.muikku.mock.CourseBuilder;
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStaffMember;
import fi.otavanopisto.pyramus.rest.model.Sex;
import fi.otavanopisto.pyramus.rest.model.UserRole;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseCreatePayload;
import fi.otavanopisto.pyramus.webhooks.WebhookCourseUpdatePayload;

public class CourseManagementTestsBase extends AbstractUITest {
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void changeCourseNameTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();

      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        waitAndClick("input[name=\"wokspace-name\"]");
        clearElement("input[name=\"wokspace-name\"]");
        sendKeys("input[name=\"wokspace-name\"]", "Testing course");

        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);

        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        
        Course course = new Course(course1.getId(), "Testing course", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null, 1L);
        String courseJson = objectMapper.writeValueAsString(course);        
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(courseJson)
            .withStatus(200)));
        
        String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload(course.getId()));
        TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".hero__workspace-title");
        assertTextIgnoreCase(".hero__workspace-title", "Testing course");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void changePublishedStateTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        
        waitForPresent(".application-sub-panel__item-data--workspace-management input[name=\"unpublish\"]");
        scrollIntoView(".application-sub-panel__item-data--workspace-management input[name=\"unpublish\"]");
        waitAndClick(".application-sub-panel__item-data--workspace-management input[name=\"unpublish\"]");
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        sleep(500);
        navigate("/coursepicker", false);
        waitForPresent(".application-panel__content .application-panel__main-container");
        assertClassPresent(".application-panel__content .application-panel__main-container", "loader-empty");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void changeNameExtensionTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        scrollIntoView("input[name=\"name-extension\"]");
        waitAndClick("input[name=\"name-extension\"]");
        clearElement("input[name=\"name-extension\"]");
        sendKeys("input[name=\"name-extension\"]", "For Test");
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        waitForNotVisible(".loading");
        
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        Course course = new Course(course1.getId(), "Test", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "For Test", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null, 1L);
        String courseJson = objectMapper.writeValueAsString(course);        
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(courseJson)
            .withStatus(200)));
        String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload(course.getId()));
        TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        

        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".hero__workspace-name-extension span");
        assertTextIgnoreCase(".hero__workspace-name-extension span", "For Test");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void changeWorkspaceTypeTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        waitForPresent("select[name=\"workspace-type\"]");
        scrollIntoView("select[name=\"workspace-type\"]");
        selectOption("select[name=\"workspace-type\"]", "PYRAMUS-2");
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        waitForNotVisible(".loading");
        
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
 
        Course course = new Course(course1.getId(), "testcourse", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 2, 
            null, null, 1L);
        String courseJson = objectMapper.writeValueAsString(course);
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", course1.getId())))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(courseJson)
            .withStatus(200)));
        
        String payload = objectMapper.writeValueAsString(new WebhookCourseUpdatePayload(course.getId()));
        TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".meta--workspace .meta__item:nth-child(3) .meta__item-description");
        assertTextIgnoreCase(".meta--workspace .meta__item:nth-child(3) .meta__item-description", "Ryhmäkurssi");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();  
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE,
        TestEnvironments.Browser.CHROME_HEADLESS
    }
  )
  public void changeLicenseTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        waitForPresent(".license-selector select");
        scrollIntoView(".license-selector select");
        selectOption(".license-selector select", "CC3");
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        waitForNotVisible(".loading");
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".footer--workspace .license__link");
        assertTextIgnoreCase(".footer--workspace .license__link", "https://creativecommons.org/licenses/by/3.0");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }
  
  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.CHROME_HEADLESS,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE
    }
  )
  public void addWorkspaceProducerTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 3).description("test course for testing").creatorId(admin.getId()).buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitAndClick(".navbar__item--settings a");
        waitForPresent("input[name=\"add-producer\"]");
        scrollIntoView("input[name=\"add-producer\"]");
        selectAllAndClear("input[name=\"add-producer\"]");
        sendKeys("input[name=\"add-producer\"]", "Mr. Tester");
        findElementByCssSelector("input[name=\"add-producer\"]").sendKeys(Keys.RETURN);
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        waitForNotVisible(".loading");
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".footer .producers__item");
        assertTextIgnoreCase(".footer .producers__item", "Mr. Tester");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  @Test
  @TestEnvironments (
      browsers = {
        TestEnvironments.Browser.CHROME,
        TestEnvironments.Browser.CHROME_HEADLESS,
        TestEnvironments.Browser.FIREFOX,
        TestEnvironments.Browser.INTERNET_EXPLORER,
        TestEnvironments.Browser.EDGE
    }
  )
  public void workspaceSignupPermissionsTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
    MockStudent student = new MockStudent(2l, 2l, "Student", "Tester", "student@example.com", 1l, OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), "121212-1212", Sex.FEMALE, TestUtilities.toDate(2012, 1, 1), TestUtilities.getNextYear());
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).addStudent(student).mockLogin(admin).build();
      Course course1 = new CourseBuilder().name("Test").id((long) 4).description("test course for testing").buildCourse();
      mockBuilder
      .addStaffMember(admin)
      .mockLogin(admin)
      .addCourse(course1)
      .build();
      login();
      Workspace workspace = createWorkspace(course1, Boolean.TRUE);
      CourseStaffMember courseStaffMember = new CourseStaffMember(1l, course1.getId(), admin.getId(), 7l);
      mockBuilder
        .addCourseStaffMember(course1.getId(), courseStaffMember)
        .build();
      try{
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitAndClick(".navbar__item--settings a");
        waitForPresent("input#usergroup1");
        scrollIntoView("input#usergroup1");
        waitAndClick("input#usergroup1");
        waitForClickable(".application-sub-pane__button-container .button");
        scrollIntoView(".application-sub-pane__button-container .button");
        waitAndClick(".application-sub-pane__button-container .button");
        waitForPresentAndVisible(".notification-queue__items");
        waitForNotVisible(".loading");
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        logout();
        mockBuilder.mockLogin(student);
        login();
        navigate("/coursepicker", false);
        waitForPresentAndVisible("div.application-panel__actions > div.application-panel__helper-container.application-panel__helper-container--main-action");
//        refresh();
        waitForPresentAndVisible("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        waitAndClick("div.application-panel__content > div.application-panel__main-container.loader-empty .application-list__item-header--course");
        waitAndClick(".button--coursepicker-course-action:nth-of-type(2)");
        assertPresent(".dialog--workspace-signup-dialog .button--standard-ok");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

  
}