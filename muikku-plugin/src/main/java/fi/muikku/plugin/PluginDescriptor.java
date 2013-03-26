package fi.muikku.plugin;

import java.util.List;

public interface PluginDescriptor {

  String getName();
  void init();
  List<Class<?>> getBeans();
  
}
