package fi.muikku.model.security;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import fi.muikku.model.workspace.WorkspaceEntity;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceGroupPermission extends GroupPermission {

  // TODO: Unique all?
  
  public WorkspaceEntity getWorkspace() {
    return workspace;
  }

  public void setWorkspace(WorkspaceEntity workspace) {
    this.workspace = workspace;
  }

  @ManyToOne
  private WorkspaceEntity workspace;
}
