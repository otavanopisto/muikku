package fi.otavanopisto.muikku.mock.model;

import java.util.List;

import fi.otavanopisto.pyramus.rest.model.CourseActivity;

public class MockCourseStudent {
  private long id;
  private long courseId;
  private long studentId;
  private List<CourseActivity> courseActivities;

  public MockCourseStudent(long id, long courseId, long studentId, List<CourseActivity> courseActivities) {
    super();
    this.id = id;
    this.courseId = courseId;
    this.studentId = studentId;
    this.courseActivities = courseActivities;
  }

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public long getCourseId() {
    return courseId;
  }

  public void setCourseId(long courseId) {
    this.courseId = courseId;
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
  
}
