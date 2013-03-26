package fi.muikku.plugin;

public interface RESTPluginDescriptor extends PluginDescriptor {

  public Class<?>[] getRESTServices();
  
}
