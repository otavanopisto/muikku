package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.courses.CourseUser;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseUserPermissionOverride extends PermissionOverride {

  // TODO: Unique all?
  public CourseUser getCourseUser() {
    return courseUser;
  }

  public void setCourseUser(CourseUser courseUser) {
    this.courseUser = courseUser;
  }

  @ManyToOne
  private CourseUser courseUser;
}
