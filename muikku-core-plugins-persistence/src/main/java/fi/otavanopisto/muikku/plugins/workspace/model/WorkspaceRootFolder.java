package fi.otavanopisto.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceRootFolder extends WorkspaceNode {

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.ROOT_FOLDER;
  }

  @Transient
  @Override
  public String getPath() {
  	return "";
  }
  
  @Column
  private Long workspaceEntityId;
}
