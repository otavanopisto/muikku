package fi.muikku.model.courses;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.model.workspace.WorkspaceEntity;

@Entity
public class CourseSettings {

  public Long getId() {
    return id;
  }

  public CourseUserRole getDefaultCourseUserRole() {
    return defaultCourseUserRole;
  }

  public void setDefaultCourseUserRole(CourseUserRole defaultCourseUserRole) {
    this.defaultCourseUserRole = defaultCourseUserRole;
  }
  
  public WorkspaceEntity getCourseEntity() {
    return courseEntity;
  }

  public void setCourseEntity(WorkspaceEntity courseEntity) {
    this.courseEntity = courseEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceEntity courseEntity;
  
  @ManyToOne
  private CourseUserRole defaultCourseUserRole;
}
