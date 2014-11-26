package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterial extends WorkspaceNode {

  public Long getMaterialId() {
		return materialId;
	}
  
  public void setMaterialId(Long materialId) {
		this.materialId = materialId;
	}

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.MATERIAL;
  }

  @NotNull
  @Column(nullable = false)
  private Long materialId;
}
