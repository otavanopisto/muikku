package fi.muikku.plugins.settings;

import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class SettingsPluginDescriptor implements PluginDescriptor {

	private static final String DOCK_SETTINGS_WIDGET_LOCATION = fi.muikku.WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER;
	private static final int DOCK_SETTINGS_WIDGET_MINIMUM_SIZE = 1;
	private static final String DOCK_SETTINGS_WIDGET_NAME = "docksettings";
	
	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "settings";
	}
	
	@Override
	public void init() {
  	Widget dockSettingsWidget = widgetController.ensureWidget(DOCK_SETTINGS_WIDGET_NAME, DOCK_SETTINGS_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED);
		
		widgetController.ensureDefaultWidget(dockSettingsWidget, DOCK_SETTINGS_WIDGET_LOCATION);
	}

	@Override
	public List<Class<?>> getBeans() {
		return null;
	}

}
