package fi.muikku.plugin;

public interface PersistencePluginDescriptor extends PluginDescriptor {

  public Class<?>[] getEntities();
  
}
