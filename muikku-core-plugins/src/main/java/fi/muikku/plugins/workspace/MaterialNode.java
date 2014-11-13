package fi.muikku.plugins.workspace;

public class MaterialNode {

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }
  
  public Long getParentId() {
    return parentId;
  }
  
  public void setParentId(Long parentId) {
    this.parentId = parentId;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public String getMaterialType() {
    return materialType;
  }

  public void setMaterialType(String materialType) {
    this.materialType = materialType;
  }

  public String getMaterialPath() {
    return materialPath;
  }

  public void setMaterialPath(String materialPath) {
    this.materialPath = materialPath;
  }

  public String getMaterialTitle() {
    return materialTitle;
  }

  public void setMaterialTitle(String materialTitle) {
    this.materialTitle = materialTitle;
  }
  
  // The id of the WorkspaceNode this material represents
  private Long workspaceMaterialId;

  // The id of this node's parent
  private Long parentId;

  // The id of the Material referenced by WorkspaceNode; null for folders
  private Long materialId;
  
  // The type of the Material referenced by WorkspaceNode, e.g. folder, html, binary
  private String materialType;
  
  // Material title
  private String materialTitle;
  
  // Relative path of the WorkspaceNode
  private String materialPath;

}
