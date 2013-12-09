package fi.muikku.plugins.material.processing;

public class ProcessingContext {
  
  public ProcessingContext() {
  }
  
  public ProcessingContext(Long materialId) {
    this.materialId = materialId;
  }

  public Long getMaterialId() {
    return materialId;
  }
  
  private Long materialId;
}
