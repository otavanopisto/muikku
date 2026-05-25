package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceMaterialFieldAnswer {

  public WorkspaceMaterialFieldAnswer() {
  }

  public WorkspaceMaterialFieldAnswer(Long workspaceMaterialId, Long materialId, String fieldName, String value) {
    super();
    this.workspaceMaterialId = workspaceMaterialId;
    this.materialId = materialId;
    this.fieldName = fieldName;
    this.value = value;
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

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
  
  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }
  
  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }
  
  private Long materialId;
  private Long workspaceMaterialId;
  private String fieldName;
  private String value;
}