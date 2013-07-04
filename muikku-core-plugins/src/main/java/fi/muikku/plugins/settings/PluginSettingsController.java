package fi.muikku.plugins.settings;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.plugin.PluginLibraryInfo;
import fi.muikku.plugin.PluginLibraryInfos;
import fi.muikku.plugins.settings.dao.PluginEntityDAO;
import fi.muikku.plugins.settings.model.Plugin;

@Dependent
@Stateful
public class PluginSettingsController {
  
  @Inject
  @PluginLibraryInfos
  private List<PluginLibraryInfo> pluginLibraryInfos;
  
  @Inject
  private PluginEntityDAO pluginDAO;
  
  public List<PluginLibraryInfo> getAllLibraries() {
    return pluginLibraryInfos;
  }
  
  public List<Plugin> getPluginsByLibrary(PluginLibraryInfo pluginLibraryInfo) {
    return pluginDAO.listByLibrary(pluginLibraryInfo.toString());
  }

  public List<Plugin> getAllPlugins() {
    List<Plugin> allPlugins = pluginDAO.listAll();
    return allPlugins;
  }
  
  public void togglePlugin(Plugin plugin) {
    plugin.setEnabled(!plugin.getEnabled());
  }
}
