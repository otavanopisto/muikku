package fi.otavanopisto.muikku;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import fi.otavanopisto.muikku.mock.model.MockCourse;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivity;
import fi.otavanopisto.pyramus.rest.model.CourseActivityState;
import fi.otavanopisto.pyramus.rest.model.CourseLength;
import fi.otavanopisto.pyramus.rest.model.CourseModule;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.EducationalTimeUnit;
import fi.otavanopisto.pyramus.rest.model.Student;
import fi.otavanopisto.pyramus.rest.model.Subject;

public class TestUtilities {
  
  public static Boolean webhookCall(String url, String payload) throws Exception {
    String signature = "38c6cbd28bf165070d070980dd1fb595";
    CloseableHttpClient client = HttpClients.createDefault();
    try {
      HttpPost httpPost = new HttpPost(url);
      try {
        StringEntity dataEntity = new StringEntity(payload);
        try {
          httpPost.addHeader("X-Pyramus-Signature", signature);
          httpPost.setEntity(dataEntity);
          client.execute(httpPost);
          return true;
        } finally {
          EntityUtils.consume(dataEntity);
        }
      } finally {
        httpPost.releaseConnection();
      }
    } finally {
      client.close();
    }
  }

  public static int sendHttpPOSTRequest(String url, String json) throws ClientProtocolException, IOException, URISyntaxException {
    CloseableHttpClient client = HttpClients.createDefault();
    try {
      URI uri = new URI(url);
      HttpPost post = new HttpPost(uri);
      try {
        StringEntity se = new StringEntity(json);  
        try {
          se.setContentType(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
          post.setEntity(se);
          return client.execute(post).getStatusLine().getStatusCode();
        } finally {
          EntityUtils.consume(se);
        }
      } finally {
        post.releaseConnection();
      }
    } finally {
      client.close();
    }
   }

  
  public static Student studentFromMockStudent(MockStudent mockStudent) {
    Map<String, String> variables = new HashMap<>();
    List<String> tags = new ArrayList<>();
    Student student = new Student(
        mockStudent.getId(),
        mockStudent.getPersonId(),
        mockStudent.getFirstName(),
        mockStudent.getLastName(), 
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        mockStudent.getStudyEndTime(),
        mockStudent.getStudyProgrammeId(),
        null,
        null,
        null,
        false,
        mockStudent.getStudyStartDate(),
        null,
        null,
        null,
        variables,
        tags,
        false);
    return student;
  }
  
  public static Course courseFromMockCourse(MockCourse mockCourse) {
    Set<CourseModule> courseModules = new HashSet<>();
    Subject subject = new Subject(1L, null, null, null, null);
    EducationalTimeUnit unit = new EducationalTimeUnit(1L, null, null, null, null);
    CourseLength courseLength = new CourseLength(mockCourse.getId(), 1d, 45d, unit);
    courseModules.add(new CourseModule(
        mockCourse.getId(),             // id
        subject,                        // subject
        1,                              // courseNumber 
        courseLength                    // courseLength
      )
    );
    
    Course course = new Course(
        mockCourse.getId(),
        mockCourse.getName(),           // name
        mockCourse.getCreated(),        // created
        mockCourse.getCreated(),        // lastModified
        mockCourse.getDescription(),    // description
        false,                          // archived
        (long) 25,                      // maxParticipantCount
        mockCourse.getBegin(),          // beginDate
        mockCourse.getEnd(),            // endDate
        "test extension",               // nameExtension
        (double) 15,                    // localTeachingDays
        (double) 45,                    // teachingHours
        (double) 45,                    // distanceTeachingHours
        (double) 15,                    // distanceTeachingDays
        (double) 45,                    // assessingHours
       
        (double) 45,                    // planningHours
        mockCourse.getEnd(),            // enrolmentTimeEnd
        (long) 1,                       // creatorId
        (long) 1,                       // lastModifierId
        null,                           // curriculumIds
        (long) 1,                       // moduleId
        (long) 1,                       // stateId
        (long) 1,                       // typeId
        null,                           // variables
        null,                           // tags
        1L,                             // organizationId
        false,                          // courseTemplate
        1L,                             // primaryEducationTypeId
        1L,                             // primaryEducationSubtypeId
        courseModules                   // courseModules
    );
    
    return course;
  }

  public static CourseStudent courseStudentFromMockCourseStudent(MockCourseStudent mockCourseStudent) {
    CourseStudent courseStudent = new CourseStudent(mockCourseStudent.getId(), mockCourseStudent.getCourseId(), mockCourseStudent.getStudentId(),
      OffsetDateTime.of(2010, 2, 2, 0, 0, 0, 0, ZoneOffset.UTC), false, null, null, null, null, null);
    return courseStudent;
  }

  public static OffsetDateTime toDate(int year, int month, int day) {
    return OffsetDateTime.of(year, month, day, 0, 0, 0, 0, ZoneOffset.UTC);
  }
  
  public static OffsetDateTime getNextYear() {
    OffsetDateTime result = OffsetDateTime.now(ZoneOffset.UTC);
    return result.plusYears(1);
  }
  
  public static OffsetDateTime getNextWeek() {
    OffsetDateTime result = OffsetDateTime.now(ZoneOffset.UTC);
    return result.plusWeeks(1);
  }

  public static OffsetDateTime getLastWeek() {
    OffsetDateTime result = OffsetDateTime.now(ZoneOffset.UTC);
    return result.minusWeeks(1);
  }
  
  public static OffsetDateTime addMonths(int months) {
    OffsetDateTime result = OffsetDateTime.now(ZoneOffset.UTC);
    return result.plusMonths(months);
  }
  
  public static Date toDate(OffsetDateTime offsetDate) {
    return new Date(offsetDate.toInstant().toEpochMilli());
  }
  
  public static List<CourseActivity> createCourseActivity(Course course, CourseActivityState courseActivityState) {
    List<CourseActivity> courseActivities = new ArrayList<>();
    CourseActivity ca = new CourseActivity();
    ca.setCourseId(course.getId());
    ca.setCourseName(course.getName());
    ca.setState(courseActivityState);
    ca.setActivityDate(TestUtilities.toDate(TestUtilities.getLastWeek()));
    courseActivities.add(ca);
    return courseActivities;
  }
  
}
