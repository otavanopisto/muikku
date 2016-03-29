package fi.otavanopisto.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceUserPermissionOverride extends PermissionOverride {

  // TODO: Unique all?

  public WorkspaceUserEntity getWorkspaceUserEntity() {
    return workspaceUserEntity;
  }

  public void setWorkspaceUserEntity(WorkspaceUserEntity workspaceUserEntity) {
    this.workspaceUserEntity = workspaceUserEntity;
  }

  @ManyToOne
  private WorkspaceUserEntity workspaceUserEntity;
}
