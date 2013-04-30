package fi.muikku.plugins.dock;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.WidgetLocations;
import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class DockPluginDescriptor implements PluginDescriptor {

  private static final String ENVIRONMENT_DOCK_WIDGET_NAME = "environmentdock";

  @Inject
  private EnvironmentController environmentController;

  @Inject
  private UserController userController;

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "dock";
  }

  @Override
  public void init() {

    Widget environmentDockWidget = widgetController.findWidget(ENVIRONMENT_DOCK_WIDGET_NAME);
    if (environmentDockWidget == null) {
      environmentDockWidget = widgetController.createWidget(ENVIRONMENT_DOCK_WIDGET_NAME, WidgetVisibility.EVERYONE);
    }

    WidgetLocation environmentDockTopWidgetLocation = widgetController.findWidgetLocation(WidgetLocations.ENVIRONMENT_DOCK_TOP);
    if (environmentDockTopWidgetLocation == null) {
      environmentDockTopWidgetLocation = widgetController.createWidgetLocation(WidgetLocations.ENVIRONMENT_DOCK_TOP);
    }
    
    DefaultWidget environmentDockDefaultWidget = widgetController.findDefaultWidget(environmentDockWidget, environmentDockTopWidgetLocation);
    if (environmentDockDefaultWidget == null) {
      environmentDockDefaultWidget = widgetController.createDefaultWidget(environmentDockTopWidgetLocation, environmentDockWidget);
    }
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>();
  }

}
