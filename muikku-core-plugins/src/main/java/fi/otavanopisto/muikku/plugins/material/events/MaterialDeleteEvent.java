package fi.otavanopisto.muikku.plugins.material.events;

public abstract class MaterialDeleteEvent <T> extends MaterialEvent<T> {

  public MaterialDeleteEvent(T material) {
    super(material);
  }
  
}
