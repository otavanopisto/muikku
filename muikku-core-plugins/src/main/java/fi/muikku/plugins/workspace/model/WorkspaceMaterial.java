package fi.muikku.plugins.workspace.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Transient;

import fi.muikku.plugins.material.model.Material;

@Entity
@PrimaryKeyJoinColumn(name="id")
public class WorkspaceMaterial extends WorkspaceNode {

  public Material getMaterial() {
		return material;
	}
  
  public void setMaterial(Material material) {
		this.material = material;
	}

  @Transient
  public WorkspaceNodeType getType() {
    return WorkspaceNodeType.MATERIAL;
  }

  @ManyToOne
  private Material material;
}
