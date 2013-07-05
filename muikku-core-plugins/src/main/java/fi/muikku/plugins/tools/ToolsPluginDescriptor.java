package fi.muikku.plugins.tools;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.WidgetLocations;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class ToolsPluginDescriptor implements PluginDescriptor {

  private static final String ENVIRONMENT_TOOLS_WIDGET_NAME = "environmenttools";

  @Inject
  private UserController userController;

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "tools";
  }

  @Override
  public void init() {

    Widget environmentToolsWidget = widgetController.findWidget(ENVIRONMENT_TOOLS_WIDGET_NAME);
    if (environmentToolsWidget == null) {
      environmentToolsWidget = widgetController.createWidget(ENVIRONMENT_TOOLS_WIDGET_NAME, 8, WidgetVisibility.AUTHENTICATED);
    }

    WidgetLocation environmentDockTopWidgetLocation = widgetController.findWidgetLocation(WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER);
    if (environmentDockTopWidgetLocation == null) {
      environmentDockTopWidgetLocation = widgetController.createWidgetLocation(WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER);
    }
    
    DefaultWidget environmentToolsDefaultWidget = widgetController.findDefaultWidget(environmentToolsWidget, environmentDockTopWidgetLocation);
    if (environmentToolsDefaultWidget == null) {
      environmentToolsDefaultWidget = widgetController.createDefaultWidget(environmentDockTopWidgetLocation, environmentToolsWidget);
    }
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>();
  }

}
