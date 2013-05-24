package fi.muikku.plugin;

import java.util.List;
import java.util.ResourceBundle;

public interface LocalizedPluginDescriptor {
  
  public List<ResourceBundle> getLocaleBundles();

}
