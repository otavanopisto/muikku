package fi.muikku.plugins;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.muikku.dao.plugins.PluginEntityDAO;
import fi.muikku.plugin.AfterPluginInitEvent;

public class PluginEntityPopulator {
  @Inject
  private PluginEntityDAO pluginEntityDAO;
  
  public void populatePlugin(@Observes AfterPluginInitEvent event) {
    String name = event.getPluginName();
    String library = event.getPluginLibrary();
    
    if (pluginEntityDAO.findByNameAndLibrary(name, library) == null) {
      pluginEntityDAO.create(name, library, true);
    }
  }
  
}
