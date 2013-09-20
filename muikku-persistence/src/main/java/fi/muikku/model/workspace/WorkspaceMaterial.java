package fi.muikku.model.workspace;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import fi.muikku.model.material.Material;

@Entity
public class WorkspaceMaterial {

  public WorkspaceEntity getWorkspaceEntity() {
    return workspaceEntity;
  }

  public void setWorkspaceEntity(WorkspaceEntity workspaceEntity) {
    this.workspaceEntity = workspaceEntity;
  }

  public Material getMaterial() {
    return material;
  }

  public void setMaterial(Material material) {
    this.material = material;
  }
  
	public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

  @ManyToOne
  private WorkspaceEntity workspaceEntity;
  
  @ManyToOne
  private Material material;
  
}
