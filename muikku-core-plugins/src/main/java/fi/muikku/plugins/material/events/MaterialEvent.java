package fi.muikku.plugins.material.events;

public class MaterialEvent {
  
  public MaterialEvent() {
  }
  
  public MaterialEvent(Long materialId) {
    this.materialId = materialId;
  }

  public Long getMaterialId() {
    return materialId;
  }
  
  private Long materialId;
}
