package fi.muikku.plugins.defaults;

import java.util.List;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.WidgetLocations;
import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class DefaultsPluginDescriptor implements PluginDescriptor {

	@Inject
	private Logger logger;

	@Inject
	private WidgetController widgetController;

	@Override
	public String getName() {
		return "defaults";
	}
	
	@Override
	public void init() {
		String[] widgetLocationNames = WidgetLocations.getAll();
		for (String widgetLocationName : widgetLocationNames) {
			WidgetLocation widgetLocation = widgetController.findWidgetLocation(widgetLocationName);
			if (widgetLocation == null) {
				logger.info("Widget location '" + widgetLocationName + "' is missing. Creating new");
				widgetLocation = widgetController.createWidgetLocation(widgetLocationName);
				if (widgetLocation != null) {
					logger.info("Widget location '" + widgetLocationName + "' was created successfully");
				}
			}
		}
	}

	@Override
	public List<Class<?>> getBeans() {
		return null;
	}


}
