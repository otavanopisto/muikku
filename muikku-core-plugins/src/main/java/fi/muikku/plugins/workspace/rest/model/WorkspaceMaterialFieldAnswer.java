package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceMaterialFieldAnswer {

  public WorkspaceMaterialFieldAnswer() {
  }

  public WorkspaceMaterialFieldAnswer(Long materialId, String embedId, String fieldName, String value) {
    super();
    this.materialId = materialId;
    this.embedId = embedId;
    this.fieldName = fieldName;
    this.value = value;
  }
  
  public Long getMaterialId() {
    return materialId;
  }
  
  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }

  public String getEmbedId() {
    return embedId;
  }

  public void setEmbedId(String embedId) {
    this.embedId = embedId;
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
  
  private Long materialId;
  private String fieldName;
  private String embedId;
  private String value;
}