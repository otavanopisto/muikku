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
import fi.otavanopisto.muikku.mock.PyramusMock.Builder;
import fi.otavanopisto.muikku.mock.model.MockStaffMember;
import fi.otavanopisto.muikku.ui.AbstractUITest;
import fi.otavanopisto.pyramus.rest.model.Course;
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        waitAndClick(".workspace-management-container input[name=\"workspaceName\"]");
        clearElement(".workspace-management-container input[name=\"workspaceName\"]");
        sendKeys(".workspace-management-container input[name=\"workspaceName\"]", "Testing course");

        ObjectMapper objectMapper = new ObjectMapper().registerModule(new JSR310Module()).disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).setSerializationInclusion(Include.NON_NULL);

        OffsetDateTime created = OffsetDateTime.of(1990, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime begin = OffsetDateTime.of(2000, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
        OffsetDateTime end = OffsetDateTime.of(2050, 1, 1, 0, 0, 0, 0, ZoneOffset.UTC);
      
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        
        Course course = new Course(courseId, "Testing course", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null);
        String courseJson = objectMapper.writeValueAsString(course);        
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
          .willReturn(aResponse()
            .withHeader("Content-Type", "application/json")
            .withBody(courseJson)
            .withStatus(200)));
        
        String payload = objectMapper.writeValueAsString(new WebhookCourseCreatePayload(course.getId()));
        TestUtilities.webhookCall("http://dev.muikku.fi:" + System.getProperty("it.port.http") + "/pyramus/webhook", payload);
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".workspace-header-wrapper .workspace-header-container h1.workspace-title");
        assertTextIgnoreCase(".workspace-header-wrapper .workspace-header-container h1.workspace-title", "Testing course");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
      try{
        navigate(String.format("/workspace/%s/workspace-management", workspace.getUrlName()), false);
        waitAndClick(".workspace-management-container .additionalinfo-data input[value=\"false\"]");
        waitAndClick(".workspace-management-footer .workspace-management-footer-actions-container button.save");
        waitForNotVisible(".loading");
        
        navigate(String.format("/workspace/%s", workspace.getUrlName()), false);
        waitForPresent(".workspace-publication-container .workspace-publish-button");
        assertVisible(".workspace-publication-container .workspace-publish-button");
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
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
        Course course = new Course(courseId, "testcourse", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "For Test", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
            null, null);
        String courseJson = objectMapper.writeValueAsString(course);        
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;      
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
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
 
        Course course = new Course(courseId, "testcourse", created, created, "<p>test course for testing</p>\n", false, 1, 
            (long) 25, begin, end, "test extension", (double) 15, (double) 45, (double) 45,
            (double) 15, (double) 45, (double) 45, end, (long) 1,
            (long) 1, (long) 1, null, (double) 45, (long) 1, (long) 1, (long) 1, (long) 2, 
            null, null);
        String courseJson = objectMapper.writeValueAsString(course);
        stubFor(put(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
            .willReturn(aResponse()
              .withHeader("Content-Type", "application/json")
              .withBody(courseJson)
              .withStatus(200)));
        
        stubFor(get(urlEqualTo(String.format("/1/courses/courses/%d", courseId)))
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
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
    MockStaffMember admin = new MockStaffMember(1l, 1l, "Admin", "User", UserRole.ADMINISTRATOR, "121212-1234", "admin@example.com", Sex.MALE);
    Builder mockBuilder = mocker();
    try {
      mockBuilder.addStaffMember(admin).mockLogin(admin).build();
      login();
      long courseId = 1l;
      Workspace workspace = createWorkspace("testcourse", "test course for testing", String.valueOf(courseId), Boolean.TRUE);
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
