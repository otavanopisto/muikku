package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.plugins.material.model.Material;

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

  private Long materialId;
}
