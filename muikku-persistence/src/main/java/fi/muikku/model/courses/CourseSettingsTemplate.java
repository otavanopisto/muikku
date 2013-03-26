package fi.muikku.model.courses;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class CourseSettingsTemplate {

  public Long getId() {
    return id;
  }

  public CourseUserRole getDefaultCourseUserRole() {
    return defaultCourseUserRole;
  }

  public void setDefaultCourseUserRole(CourseUserRole defaultCourseUserRole) {
    this.defaultCourseUserRole = defaultCourseUserRole;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private CourseUserRole defaultCourseUserRole;
}
