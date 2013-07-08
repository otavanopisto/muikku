package fi.muikku.plugins.settings;

import java.util.List;

import javax.ejb.Stateful;
import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.plugins.PluginEntityDAO;
import fi.muikku.model.plugins.Plugin;

@Dependent
public class PluginSettingsController {
  
  @Inject
  private PluginEntityDAO pluginDAO;

  public List<Plugin> getAllPlugins() {
    List<Plugin> allPlugins = pluginDAO.listAll();
    return allPlugins;
  }
  
  public void togglePluginById(Long id) {
    Plugin plugin = pluginDAO.findById(id);
    pluginDAO.updateEnabled(plugin, !plugin.getEnabled());
  }
}
