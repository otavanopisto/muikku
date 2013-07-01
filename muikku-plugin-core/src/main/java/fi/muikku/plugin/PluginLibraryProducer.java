package fi.muikku.plugin;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Produces;

import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginLibraryProducer {
  
  @Dependent
  @PluginLibraryInfos
  @Produces
  public List<PluginLibraryInfo> producePluginLibraryInfos() throws PluginManagerException {
    return SingletonPluginManager.getInstance().getLoadedPluginLibraryInfos();
  }
}
