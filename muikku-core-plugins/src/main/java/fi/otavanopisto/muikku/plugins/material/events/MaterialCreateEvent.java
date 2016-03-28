package fi.otavanopisto.muikku.plugins.material.events;

public abstract class MaterialCreateEvent <T> extends MaterialEvent<T> {

  public MaterialCreateEvent(T material) {
    super(material);
  }
  
}
