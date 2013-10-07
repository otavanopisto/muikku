package fi.muikku.plugins.settings;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.plugins.Plugin;
import fi.muikku.schooldata.WorkspaceController;

@Named
@RequestScoped
public class SettingsBackingBean {
	
	@Inject
	private PluginSettingsController pluginSettingsController;

	@Inject
	private WorkspaceController workspaceController;
	
  public List<Plugin> getAllPlugins() {
    return pluginSettingsController.getAllPlugins();
  }
  
  public void togglePlugin() {
    FacesContext context = FacesContext.getCurrentInstance();
    String idString = (String) context.getExternalContext().getRequestParameterMap().get(
        "pluginId");
    Long id = Long.valueOf(idString);
    togglePluginById(id);
  }
  
  public void togglePluginById(long id) {
    pluginSettingsController.togglePluginById(id);
  }

}

