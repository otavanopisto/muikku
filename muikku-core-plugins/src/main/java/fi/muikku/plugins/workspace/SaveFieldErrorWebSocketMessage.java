package fi.muikku.plugins.workspace;

public class SaveFieldErrorWebSocketMessage {

  public SaveFieldErrorWebSocketMessage() {
  }
  
  public SaveFieldErrorWebSocketMessage(String error, String embedId, Long materialId, String fieldName, Long workspaceMaterialId, Long workspaceEntityId) {
    super();
    this.error = error;
    this.embedId = embedId;
    this.materialId = materialId;
    this.fieldName = fieldName;
    this.workspaceMaterialId = workspaceMaterialId;
    this.workspaceEntityId = workspaceEntityId;
  }

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
