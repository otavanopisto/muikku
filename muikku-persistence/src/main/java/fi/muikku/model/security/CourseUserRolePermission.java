package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.stub.courses.CourseEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseUserRolePermission extends UserRolePermission {

  // TODO: Unique all?
  
  public CourseEntity getCourse() {
    return course;
  }

  public void setCourse(CourseEntity course) {
    this.course = course;
  }

  @ManyToOne
  private CourseEntity course;
}
