package fi.otavanopisto.muikku.plugins.workspace;

public class SaveFieldErrorWebSocketMessage {

  public SaveFieldErrorWebSocketMessage() {
  }
  
  public SaveFieldErrorWebSocketMessage(String error, String fieldName, Long workspaceMaterialId) {
    this.error = error;
    this.fieldName = fieldName;
    this.workspaceMaterialId = workspaceMaterialId;
  }

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
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

  private String error;
  private String fieldName;
  private Long workspaceMaterialId;

}
