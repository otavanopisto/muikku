package fi.muikku.plugins.workspace;

public class SaveFieldErrorWebSocketMessage {

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }

  public String getEmbedId() {
    return embedId;
  }

  public void setEmbedId(String embedId) {
    this.embedId = embedId;
  }

  public Long getMaterialId() {
    return materialId;
  }

  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public String getFieldName() {
    return fieldName;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }

  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }

  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  private String error;
  private String embedId;
  private Long materialId;
  private String fieldName;
  private Long workspaceMaterialId;
  private Long workspaceEntityId;
}
