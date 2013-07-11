package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.workspace.WorkspaceEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class CourseRolePermission extends RolePermission {

  // TODO: Unique all?
  
  public WorkspaceEntity getCourse() {
    return course;
  }

  public void setCourse(WorkspaceEntity course) {
    this.course = course;
  }

  @ManyToOne
  private WorkspaceEntity course;
}
