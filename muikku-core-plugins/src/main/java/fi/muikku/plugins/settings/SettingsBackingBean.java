package fi.muikku.plugins.settings;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.UserController;
import fi.muikku.model.users.UserImpl;
import fi.muikku.model.plugins.Plugin;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

@Named
@RequestScoped
public class SettingsBackingBean {
	
	@Inject
	private UserController userController;

	@Inject
	private PluginSettingsController pluginSettingsController;

	public WidgetSpaceSet getContentWidgetSpaceSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(fi.muikku.WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE)
		);
	}
	
	public List<UserImpl> getAllUsers() {
		List<UserImpl> users = userController.listAllUsers();
		return users;
	}
  
  public List<Plugin> getAllPlugins() {
    return pluginSettingsController.getAllPlugins();
  }
  
  public void togglePlugin(Plugin plugin) {
    pluginSettingsController.togglePlugin(plugin);
  }

}

