package fi.otavanopisto.muikku.mock.model;

import java.util.List;

import fi.otavanopisto.pyramus.rest.model.Course;
import fi.otavanopisto.pyramus.rest.model.CourseActivity;

public class MockCourseStudent {
  private long id;
  private long studentId;
  private List<CourseActivity> courseActivities;
  private Course course;

  public MockCourseStudent(long id, Course course, long studentId, List<CourseActivity> courseActivities) {
    super();
    this.id = id;
    this.setCourse(course);
    this.studentId = studentId;
    this.courseActivities = courseActivities;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public long getStudentId() {
    return studentId;
  }

  public void setStudentId(long studentId) {
    this.studentId = studentId;
  }
  
  public List<CourseActivity> getCourseActivities() {
    return courseActivities;
  }

  public void setCourseActivities(List<CourseActivity> courseActivities) {
    this.courseActivities = courseActivities;
  }

  public Course getCourse() {
    return course;
  }

  public void setCourse(Course course) {
    this.course = course;
  }
  
}
