package fi.muikku.ui.base;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlMatching;
import static org.junit.Assert.assertTrue;

import java.io.IOException;

import org.joda.time.DateTime;
import org.junit.Test;
import org.openqa.selenium.By;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import com.jayway.restassured.response.Response;

import fi.muikkku.ui.AbstractUITest;
import fi.muikku.SqlAfter;
import fi.muikku.SqlBefore;
import fi.pyramus.rest.model.Course;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void coursePickerExistsTest() throws IOException {
    studentPyramusLoginMocks();
    workspace1PyramusMock();
//    getWebDriver().get(getAppUrl() + "/test/reindex");    
    Response response = asAdmin()
      .get("/test/reindex");
    
    getWebDriver().get(getAppUrl() + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl() + "/coursepicker");
    waitForElementToBePresent(By.className("bt-mainFunction-content"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("coursePicker")).size() > 0;
    assertTrue(elementExists);
  }
  
  private void workspace1PyramusMock() throws JsonProcessingException {
    DateTime created = new DateTime(1990, 2, 2, 0, 0, 0, 0);
    DateTime begin = new DateTime(2000, 1, 1, 0, 0, 0, 0);
    DateTime end = new DateTime(2050, 1, 1, 0, 0, 0, 0);
    Course course = new Course((long) 1, "testCourse", created, created, "test course for testing", false, 1, 
      (long) 25, begin, end, "test extension", (double) 15, (double) 45,
      (double) 15, (double) 45, (double) 45, end, (long) 1,
      (long) 1, (long) 1, (double) 45, (long) 1, (long) 1, (long) 1, (long) 1, 
      null, null);
    ObjectMapper objectMapper = new ObjectMapper().registerModule(new JodaModule()).enable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    String courseJson = objectMapper.writeValueAsString(course);
    stubFor(get(urlMatching("/1/courses/courses"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseJson)
        .withStatus(200)));
    
    stubFor(get(urlMatching("/1/courses/courses/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseJson)
        .withStatus(200)));
  }
  
}
