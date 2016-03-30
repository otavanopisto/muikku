package fi.otavanopisto.muikku.plugins.material.events;

public abstract class MaterialUpdateEvent <T> extends MaterialEvent<T> {

  public MaterialUpdateEvent(T material) {
    super(material);
  }
  
}
