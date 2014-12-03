package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceMaterial {

  public WorkspaceMaterial() {
  }

  public WorkspaceMaterial(Long id, Long materialId, Long parentId, Long nextSiblingId, Boolean hidden) {
    super();
    this.id = id;
    this.materialId = materialId;
    this.parentId = parentId;
    this.nextSiblingId = nextSiblingId;
    this.hidden = hidden;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public Long getParentId() {
    return parentId;
  }

  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Long getNextSiblingId() {
    return nextSiblingId;
  }
  
  public void setNextSiblingId(Long nextSiblingId) {
    this.nextSiblingId = nextSiblingId;
  }
  
  public Boolean getHidden() {
    return hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  private Long id;
  private Long materialId;
  private Long parentId;
  private Long nextSiblingId;
  private Boolean hidden;
}