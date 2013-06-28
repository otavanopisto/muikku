package fi.muikku.plugins.content;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class ContentPluginDescriptor implements PluginDescriptor {

	private static final String CONTENT_WIDGET_LOCATION = fi.muikku.WidgetLocations.ENVIRONMENT_CONTENT;
	private static final int CONTENT_WIDGET_MINIMUM_SIZE = 1;
	private static final String CONTENT_WIDGET_NAME = "content";
	
	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "content";
	}
	
	@Override
	public void init() {
		widgetController.ensureDefaultWidget(widgetController.ensureWidget(CONTENT_WIDGET_NAME, CONTENT_WIDGET_MINIMUM_SIZE, WidgetVisibility.AUTHENTICATED), CONTENT_WIDGET_LOCATION);
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		}));
	}

}
