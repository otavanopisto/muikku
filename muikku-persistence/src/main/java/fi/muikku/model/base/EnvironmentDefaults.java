package fi.muikku.model.base;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.model.users.EnvironmentRoleEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;

@Entity
public class EnvironmentDefaults {

  public EnvironmentRoleEntity getDefaultUserRole() {
    return defaultUserRole;
  }

  public void setDefaultUserRole(EnvironmentRoleEntity defaultUserRole) {
    this.defaultUserRole = defaultUserRole;
  }

  public WorkspaceRoleEntity getDefaultCourseCreatorRole() {
    return defaultCourseCreatorRole;
  }

  public void setDefaultCourseCreatorRole(WorkspaceRoleEntity defaultCourseCreatorRole) {
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
  private WorkspaceRoleEntity defaultCourseCreatorRole;
}
