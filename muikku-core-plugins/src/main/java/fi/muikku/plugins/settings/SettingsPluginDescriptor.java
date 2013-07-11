package fi.muikku.plugins.settings;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class SettingsPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

	private static final String DOCK_SETTINGS_WIDGET_LOCATION = fi.muikku.WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER;
	private static final int DOCK_SETTINGS_WIDGET_MINIMUM_SIZE = 1;
	private static final String DOCK_SETTINGS_WIDGET_NAME = "docksettings";
  private static final WidgetVisibility DOCK_SETTINGS_VISIBILITY = WidgetVisibility.AUTHENTICATED;
  
	private static final String USERS_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
	private static final int USERS_WIDGET_MINIMUM_SIZE = 1;
	private static final String USERS_WIDGET_NAME = "settings-navigation-users";
  private static final WidgetVisibility USERS_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
  
	private static final String ROLES_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
	private static final int ROLES_WIDGET_MINIMUM_SIZE = 1;
	private static final String ROLES_WIDGET_NAME = "settings-navigation-roles";
  private static final WidgetVisibility ROLES_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
	
	private static final String WORKSPACES_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
	private static final int WORKSPACES_WIDGET_MINIMUM_SIZE = 1;
	private static final String WORKSPACES_WIDGET_NAME = "settings-navigation-workspaces";
  private static final WidgetVisibility WORKSPACES_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
	
	private static final String WORKSPACETYPES_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
	private static final int WORKSPACETYPES_WIDGET_MINIMUM_SIZE = 1;
	private static final String WORKSPACETYPES_WIDGET_NAME = "settings-navigation-workspace-types";
  private static final WidgetVisibility WORKSPACETYPES_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
	
	private static final String PLUGINS_WIDGET_LOCATION = WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT;
  private static final int PLUGINS_WIDGET_MINIMUM_SIZE = 1;
  private static final String PLUGINS_WIDGET_NAME = "settings-navigation-plugins";
  private static final WidgetVisibility PLUGINS_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
  
	private static final String USERS_ADD_WIDGET_LOCATION = WidgetLocations.SETTINGS_USERS_CONTENT_TOOLS_TOP_RIGHT;
	private static final int USERS_ADD_WIDGET_MINIMUM_SIZE = 1;
	private static final String USERS_ADD_WIDGET_NAME = "settings-users-add";
	private static final WidgetVisibility USERS_ADD_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
			
	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "settings";
	}
	
	@Override
	public void init() {
		/**
		 * Dock widget
		 */
		
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(DOCK_SETTINGS_WIDGET_NAME, DOCK_SETTINGS_WIDGET_MINIMUM_SIZE, DOCK_SETTINGS_VISIBILITY), DOCK_SETTINGS_WIDGET_LOCATION);
		
		/**
		 * Settings navigation widgets
		 */
		
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(USERS_WIDGET_NAME, USERS_WIDGET_MINIMUM_SIZE, USERS_WIDGET_VISIBILITY), USERS_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(ROLES_WIDGET_NAME, ROLES_WIDGET_MINIMUM_SIZE, ROLES_WIDGET_VISIBILITY), ROLES_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(WORKSPACES_WIDGET_NAME, WORKSPACES_WIDGET_MINIMUM_SIZE, WORKSPACES_WIDGET_VISIBILITY), WORKSPACES_WIDGET_LOCATION);
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(WORKSPACETYPES_WIDGET_NAME, WORKSPACETYPES_WIDGET_MINIMUM_SIZE, WORKSPACETYPES_WIDGET_VISIBILITY), WORKSPACETYPES_WIDGET_LOCATION);
    widgetController.ensureDefaultWidget(widgetController.ensureWidget(PLUGINS_WIDGET_NAME, PLUGINS_WIDGET_MINIMUM_SIZE, PLUGINS_WIDGET_VISIBILITY), PLUGINS_WIDGET_LOCATION);

		/**
		 * Settings / users
		 */

    widgetController.ensureDefaultWidget(widgetController.ensureWidget(USERS_ADD_WIDGET_NAME, USERS_ADD_WIDGET_MINIMUM_SIZE, USERS_ADD_WIDGET_VISIBILITY), USERS_ADD_WIDGET_LOCATION);
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		  /* Backing beans */ 
				
			SettingsBackingBean.class,
		  WorkspaceSettingsViewBackingBean.class,
		  WorkspaceTypeSettingsViewBackingBean.class,
		  
		  /* Controllers */
		  
		  PluginSettingsController.class,
		}));
	}


  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.settings.SettingsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.settings.SettingsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }
}
