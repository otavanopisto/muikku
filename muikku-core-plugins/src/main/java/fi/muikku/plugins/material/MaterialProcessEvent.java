package fi.muikku.plugins.material;

public class MaterialProcessEvent {
  
  public MaterialProcessEvent() {
  }
  
  public MaterialProcessEvent(Long materialId) {
    this.materialId = materialId;
  }

  public Long getMaterialId() {
    return materialId;
  }
  
  private Long materialId;
}
