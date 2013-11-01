package fi.muikku.model.workspace;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import fi.muikku.model.users.UserEntity;
import fi.muikku.model.util.ArchivableEntity;
import fi.muikku.model.workspace.WorkspaceRoleEntity;
import fi.muikku.model.workspace.WorkspaceEntity;

@Entity
public class WorkspaceUserEntity implements ArchivableEntity {

  public Long getId() {
    return id;
  }

  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }

  public UserEntity getUser() {
    return user;
  }

  public void setUser(UserEntity user) {
    this.user = user;
  }

  public WorkspaceRoleEntity getWorkspaceUserRole() {
    return workspaceUserRole;
  }

  public void setWorkspaceUserRole(WorkspaceRoleEntity workspaceUserRole) {
    this.workspaceUserRole = workspaceUserRole;
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
  private WorkspaceEntity workspaceEntity;
  
  @ManyToOne
  private UserEntity user;
  
  @ManyToOne
  private WorkspaceRoleEntity workspaceUserRole;

  @NotNull
  @Column(nullable = false)
  private Boolean archived = Boolean.FALSE;
}
