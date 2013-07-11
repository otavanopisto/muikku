package fi.muikku.model.base;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.model.courses.CourseUserRole;
import fi.muikku.model.users.EnvironmentRoleEntity;

@Entity
public class EnvironmentDefaults {

  public EnvironmentRoleEntity getDefaultUserRole() {
    return defaultUserRole;
  }

  public void setDefaultUserRole(EnvironmentRoleEntity defaultUserRole) {
    this.defaultUserRole = defaultUserRole;
  }

  public CourseUserRole getDefaultCourseCreatorRole() {
    return defaultCourseCreatorRole;
  }

  public void setDefaultCourseCreatorRole(CourseUserRole defaultCourseCreatorRole) {
    this.defaultCourseCreatorRole = defaultCourseCreatorRole;
  }

  public Long getId() {
    return id;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @ManyToOne
  private EnvironmentRoleEntity defaultUserRole;

  @ManyToOne
  private CourseUserRole defaultCourseCreatorRole;
}
