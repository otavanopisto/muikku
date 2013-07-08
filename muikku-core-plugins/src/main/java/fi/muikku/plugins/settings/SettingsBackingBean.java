package fi.muikku.plugins.settings;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.model.plugins.Plugin;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

@Named
@RequestScoped
public class SettingsBackingBean {
	
	@Inject
	private UserSchoolDataController userSchoolDataController;

	@Inject
	private PluginSettingsController pluginSettingsController;

	public WidgetSpaceSet getContentWidgetSpaceSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(fi.muikku.WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE)
		);
	}
	
	public WidgetSpaceSet getSettingsUsersContentToolsTopSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_USERS_CONTENT_TOOLS_TOP_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_USERS_CONTENT_TOOLS_TOP_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_USERS_CONTENT_TOOLS_TOP_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}
	
	public List<User> getAllUsers() {
		List<User> users = userSchoolDataController.listUsers();
		return users;
	}
  
  public List<Plugin> getAllPlugins() {
    return pluginSettingsController.getAllPlugins();
  }
  
  public void togglePlugin(Plugin plugin) {
    pluginSettingsController.togglePlugin(plugin);
  }

}

