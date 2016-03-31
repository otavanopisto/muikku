package fi.otavanopisto.muikku.plugins.material.rest;

public class MaterialMeta {

  public MaterialMeta() {
  }

  public MaterialMeta(Long materialId, String key, String value) {
    super();
    this.materialId = materialId;
    this.key = key;
    this.value = value;
  }
  
  public String getKey() {
    return key;
  }
  
  public void setKey(String key) {
    this.key = key;
  }
  
  public Long getMaterialId() {
    return materialId;
  }
  
  public void setMaterialId(Long materialId) {
    this.materialId = materialId;
  }
  
  public String getValue() {
    return value;
  }
  
  public void setValue(String value) {
    this.value = value;
  }

  private Long materialId;
  private String key;
  private String value;
}
