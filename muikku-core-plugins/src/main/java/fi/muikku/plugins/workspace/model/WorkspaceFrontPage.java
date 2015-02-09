package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceFrontPage extends WorkspaceNode {

  public Long getMaterialId() {
    return materialId;
  }
  
  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.FRONT_PAGE;
  }

  @Transient
  @Override
  public String getPath() {
  	return "";
  }
  
  @NotNull
  @Column(nullable = false)
  private Long materialId;
  
  @Column
  private Long workspaceEntityId;
}
