package fi.muikku.model.courses;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ArchivableEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

@Entity
public class CourseUser implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public WorkspaceEntity getCourse() {
    return course;
  }

  public void setCourse(WorkspaceEntity course) {
    this.course = course;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public CourseUserRole getCourseUserRole() {
    return courseUserRole;
  }

  public void setCourseUserRole(CourseUserRole courseUserRole) {
    this.courseUserRole = courseUserRole;
  }
  
  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceEntity course;
  
  @ManyToOne
  private UserEntity user;
  
  @ManyToOne
  private CourseUserRole courseUserRole;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
