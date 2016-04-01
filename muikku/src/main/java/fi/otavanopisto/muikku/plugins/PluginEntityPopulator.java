package fi.otavanopisto.muikku.plugins;

import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.plugins.PluginEntityDAO;
import fi.otavanopisto.muikku.plugin.AfterPluginInitEvent;

public class PluginEntityPopulator {
  
  @Inject
  private PluginEntityDAO pluginEntityDAO;
  
  public void populatePlugin(@Observes AfterPluginInitEvent event) {
    String name = event.getPluginName();
    
    if (pluginEntityDAO.findByName(name) == null) {
      pluginEntityDAO.create(name, true);
    }
  }
  
}
