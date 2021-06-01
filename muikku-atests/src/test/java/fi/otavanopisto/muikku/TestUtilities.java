package fi.otavanopisto.muikku;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import fi.otavanopisto.muikku.mock.model.MockCourse;
import fi.otavanopisto.muikku.mock.model.MockCourseStudent;
import fi.otavanopisto.muikku.mock.model.MockStudent;
import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseStudent;
import fi.otavanopisto.pyramus.rest.model.Student;

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
    Course course = new Course(
        mockCourse.getId(),
        mockCourse.getName(),
        mockCourse.getCreated(),
        mockCourse.getCreated(),
        mockCourse.getDescription(),
        false,
        1, 
       (long) 25,
       mockCourse.getBegin(),
       mockCourse.getEnd(),
       "test extension",
       (double) 15,
       (double) 45,
       (double) 45,
       (double) 15,
       (double) 45,
       (double) 45,
       mockCourse.getEnd(),
       (long) 1,
       (long) 1,
       (long) 1,
       null,
       (double) 45,
       (long) 1,
       (long) 1,
       (long) 1,
       (long) 1, 
       null,
       null,
       1L,
       false,
       1L,
       1L);
    
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
  
}
