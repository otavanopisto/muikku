package fi.muikku.ui.base;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
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
import fi.muikku.schooldata.entity.Subject;
import fi.pyramus.rest.model.Course;
import fi.pyramus.rest.model.CourseType;
import fi.pyramus.rest.model.EducationType;
import fi.pyramus.rest.model.EducationalTimeUnit;
import fi.pyramus.rest.model.Student;

public class CoursePickerTestsBase extends AbstractUITest {
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void coursePickerExistsTest() throws IOException {
    studentPyramusLoginMocks();
    workspace1PyramusMock();
//    getWebDriver().get(getAppUrl() + "/test/reindex");    
    asAdmin()
      .get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/coursepicker/");
    waitForElementToBePresent(By.className("bt-mainFunction-content"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("coursePicker")).size() > 0;
    assertTrue(elementExists);
  }
  
  @Test
  @SqlBefore("sql/workspace1Setup.sql")
  @SqlAfter("sql/workspace1Delete.sql")
  public void courseExistsTest() throws IOException {
    studentPyramusLoginMocks();
    workspace1PyramusMock();
//    getWebDriver().get(getAppUrl() + "/test/reindex");    
    asAdmin()
      .get("/test/reindex");
    
    getWebDriver().get(getAppUrl(true) + "/login?authSourceId=1");
    waitForElementToBePresent(By.className("index"));
    getWebDriver().get(getAppUrl(true) + "/workspace/testCourse");
    waitForElementToBePresent(By.className("workspace-title"));
    takeScreenshot();
    boolean elementExists = getWebDriver().findElements(By.className("workspace-title")).size() > 0;
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
    stubFor(get(urlEqualTo("/1/courses/courses/"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseJson)
        .withStatus(200)));
    
    stubFor(get(urlMatching("/1/courses/courses/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseJson)
        .withStatus(200)));
    
    fi.pyramus.rest.model.Subject subject = new fi.pyramus.rest.model.Subject((long) 1, "tc_11", "Test course", (long) 1, false);
    String subjectJson = objectMapper.writeValueAsString(subject);
    stubFor(get(urlMatching("/1/common/subjects/.*"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(subjectJson)
        .withStatus(200)));
    
    fi.pyramus.rest.model.CourseType courseType = new fi.pyramus.rest.model.CourseType((long) 1, "Nonstop", false);
    CourseType[] courseTypeArray = { courseType };
    String courseTypeJson = objectMapper.writeValueAsString(courseTypeArray);
    stubFor(get(urlEqualTo("/1/courses/courseTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseTypeJson)
        .withStatus(200)));

    String courseTypeSingleJson = objectMapper.writeValueAsString(courseType);
    stubFor(get(urlEqualTo("/1/courses/courseTypes/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(courseTypeSingleJson)
        .withStatus(200)));

    EducationType educationType = new EducationType((long) 1, "testEduType", "ET", false);
    String educationTypeJson = objectMapper.writeValueAsString(educationType);
    stubFor(get(urlEqualTo("/1/common/educationTypes/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(educationTypeJson)
        .withStatus(200)));
    
    EducationType[] educationTypeArray = { educationType };
    String educationTypeArrayJson = objectMapper.writeValueAsString(educationTypeArray);
    stubFor(get(urlEqualTo("/1/common/educationTypes"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(educationTypeArrayJson)
        .withStatus(200)));
    
    EducationalTimeUnit educationalTimeUnit = new EducationalTimeUnit((long) 1, "test time unit", "h", (double) 1, false);
    String eduTimeUnitJson = objectMapper.writeValueAsString(educationalTimeUnit);
    stubFor(get(urlEqualTo("/1/common/educationalTimeUnits/1"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(eduTimeUnitJson)
        .withStatus(200)));
    
    EducationalTimeUnit[] eduTimeUnitArray = { educationalTimeUnit };
    String eduTimeUnitArrayJson = objectMapper.writeValueAsString(eduTimeUnitArray);
    stubFor(get(urlEqualTo("/1/common/educationalTimeUnits"))
      .willReturn(aResponse()
        .withHeader("Content-Type", "application/json")
        .withBody(eduTimeUnitArrayJson)
        .withStatus(200)));
    
  }
  
}
