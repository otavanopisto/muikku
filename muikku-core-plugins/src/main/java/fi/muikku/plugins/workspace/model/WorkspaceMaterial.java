package fi.muikku.plugins.workspace.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.NotEmpty;

import fi.muikku.plugins.material.model.Material;

@Entity
public class WorkspaceMaterial {

  public Long getId() {
    return id;
  }

  public String getUrlName() {
		return urlName;
	}
  
  public void setUrlName(String urlName) {
		this.urlName = urlName;
	}
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public Material getMaterial() {
		return material;
	}
  
  public void setMaterial(Material material) {
		this.material = material;
	}
  
  public WorkspaceFolder getFolder() {
		return folder;
	}
  
  public void setFolder(WorkspaceFolder folder) {
		this.folder = folder;
	}
  
  @Id
  @GeneratedValue (strategy = GenerationType.IDENTITY)
  private Long id;
  
  @NotEmpty
  @NotNull
  @Column (nullable = false)
  private String urlName;
  
  @ManyToOne
  private Material material;

  @ManyToOne
  private WorkspaceFolder folder;
}
