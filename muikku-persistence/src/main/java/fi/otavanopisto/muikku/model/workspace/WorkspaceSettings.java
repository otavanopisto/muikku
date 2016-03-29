package fi.otavanopisto.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class WorkspaceSettings {

  public Long getId() {
    return id;
  }

  public WorkspaceRoleEntity getDefaultWorkspaceUserRole() {
    return defaultWorkspaceUserRole;
  }

  public void setDefaultWorkspaceUserRole(WorkspaceRoleEntity defaultWorkspaceUserRole) {
    this.defaultWorkspaceUserRole = defaultWorkspaceUserRole;
  }
  
  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }

  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  private WorkspaceEntity workspaceEntity;
  
  @ManyToOne
  private WorkspaceRoleEntity defaultWorkspaceUserRole;
}
