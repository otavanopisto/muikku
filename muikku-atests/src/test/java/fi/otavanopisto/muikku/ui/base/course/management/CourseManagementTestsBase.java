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
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        waitAndClick(".application-sub-panel__body--workspace-description input");
        clearElement(".application-sub-panel__body--workspace-description input");
        sendKeys(".application-sub-panel__body--workspace-description input", "Testing course");

        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
      
        waitAndClick(".panel__footer .button");
        waitForPresentAndVisible(".notification-queue__items");
        
        Course course = new Course(course1.getId(), "Testing course", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null);
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        
        waitForPresent("section:nth-child(3) div.application-sub-panel__item-data.application-sub-panel__item-data--workspace-management > span:nth-child(2) > input[type=\"radio\"]");
        scrollIntoView("section:nth-child(3) div.application-sub-panel__item-data.application-sub-panel__item-data--workspace-management > span:nth-child(2) > input[type=\"radio\"]");
        waitAndClick("section:nth-child(3) div.application-sub-panel__item-data.application-sub-panel__item-data--workspace-management > span:nth-child(2) > input[type=\"radio\"]");
        waitAndClick(".panel__footer .button");
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
  public void changeAdditionalInfoTest() throws Exception {
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        scrollIntoView(".additionalinfo-data input[name=\"workspaceNameExtension\"]");
        waitAndClick(".additionalinfo-data input[name=\"workspaceNameExtension\"]");
        clearElement(".additionalinfo-data input[name=\"workspaceNameExtension\"]");
        sendKeys(".additionalinfo-data input[name=\"workspaceNameExtension\"]", "For Test");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        Course course = new Course(course1.getId(), "Test", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "For Test", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null);
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
        waitForPresent(".workspace-header-wrapper .workspace-additional-info-wrapper span");
        assertTextIgnoreCase(".workspace-header-wrapper .workspace-additional-info-wrapper span", "For Test");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        waitForPresent(".additionalinfo-data .workspace-type");
        scrollIntoView(".additionalinfo-data .workspace-type");
        selectOption(".additionalinfo-data .workspace-type", "PYRAMUS-2");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");        
        waitForNotVisible(".loading");
        
        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
 
        Course course = new Course(course1.getId(), "testcourse", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 2, 
            null, null);
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
        waitForPresent(".workspace-meta-wrapper .workspace-meta-item-wrapper:nth-child(3) .workspace-meta-desc");
        assertTextIgnoreCase(".workspace-meta-wrapper .workspace-meta-item-wrapper:nth-child(3) .workspace-meta-desc", "Ryhmäkurssi");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        waitForPresent(".workspace-material-license select");
        scrollIntoView(".workspace-material-license select");
        selectOption(".workspace-material-license select", "cc-3.0");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".workspace-footer-license-wrapper .workspace-material-license");
        assertTextIgnoreCase(".workspace-footer-license-wrapper .workspace-material-license", "https://creativecommons.org/licenses/by-sa/3.0");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "Person", UserRole.ADMINISTRATOR, "090978-1234", "testadmin@example.com", Sex.MALE);
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
        waitForPresent(".workspace-material-producers input");
        scrollIntoView(".workspace-material-producers input");
        sendKeys(".workspace-material-producers input", "Mr. Tester");
        findElementByCssSelector(".workspace-material-producers input").sendKeys(Keys.RETURN);
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".workspace-material-producer");
        assertTextIgnoreCase(".workspace-material-producer", "Mr. Tester");
      }finally{
        deleteWorkspace(workspace.getId());  
      }
    }finally{
      mockBuilder.wiremockReset();
    }
  }

}
