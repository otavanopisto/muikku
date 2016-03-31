package fi.otavanopisto.muikku.plugins.material.events;

public abstract class MaterialEvent <T> {

  public MaterialEvent(T material) {
    this.material = material;
  }
  
  public T getMaterial() {
    return material;
  }
  
  public void setMaterial(T material) {
    this.material = material;
  }
  
  private T material;
}
