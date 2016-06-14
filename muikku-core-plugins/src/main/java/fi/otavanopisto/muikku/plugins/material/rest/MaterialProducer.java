package fi.otavanopisto.muikku.plugins.material.rest;

public class MaterialProducer {

  public MaterialProducer() {
  }

  public MaterialProducer(Long id, String name, Long materialId) {
    super();
    this.id = id;
    this.name = name;
    this.materialId = materialId;
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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  private Long id;
  private String name;
  private Long materialId;
}
