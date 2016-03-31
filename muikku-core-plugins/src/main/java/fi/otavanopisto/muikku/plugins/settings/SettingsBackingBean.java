package fi.otavanopisto.muikku.plugins.settings;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.model.plugins.Plugin;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@RequestScoped
public class SettingsBackingBean {
	
	@Inject
	private PluginSettingsController pluginSettingsController;
	
	@Inject
	private SessionController sessionController;
	
  public List<Plugin> getAllPlugins() {
    return pluginSettingsController.getAllPlugins();
  }
  
  public void togglePlugin() {
    if (sessionController.hasPermission(MuikkuPermissions.ADMIN, null)) {
      FacesContext context = FacesContext.getCurrentInstance();
      String idString = (String) context.getExternalContext().getRequestParameterMap().get(
          "pluginId");
      Long id = Long.valueOf(idString);
      togglePluginById(id);
    }
  }
  
  public void togglePluginById(long id) {
    pluginSettingsController.togglePluginById(id);
  }

}

