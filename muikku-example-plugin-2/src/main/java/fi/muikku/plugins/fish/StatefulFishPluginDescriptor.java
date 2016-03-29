package fi.otavanopisto.muikku.plugins.fish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.controller.WidgetController;
import fi.otavanopisto.muikku.model.widgets.DefaultWidget;
import fi.otavanopisto.muikku.model.widgets.Widget;
import fi.otavanopisto.muikku.model.widgets.WidgetSpace;
import fi.otavanopisto.muikku.model.widgets.WidgetVisibility;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class StatefulFishPluginDescriptor implements PluginDescriptor {

  private static final String FISH_WIDGET_LOCATION = "environment.header.left";
  private static final String FISH_WIDGET_NAME = "statefulfish";
  private static final int FISH_WIDGET_MINIMUM_SIZE = 8;

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "statefulfish";
  }

  @Override
  public void init() {
    Widget widget = widgetController.findWidget(FISH_WIDGET_NAME);
    if (widget == null) {
      widget = widgetController.createWidget(FISH_WIDGET_NAME, FISH_WIDGET_MINIMUM_SIZE, WidgetVisibility.EVERYONE);
    }

    WidgetSpace widgetSpace = widgetController.findWidgetSpace(FISH_WIDGET_LOCATION);
    if (widgetSpace == null) { // TODO: In a perfect world, there would be no null checks
      widgetSpace = widgetController.createWidgetSpace(FISH_WIDGET_LOCATION);
    }

    DefaultWidget defaultWidget = widgetController.findDefaultWidget(widget, widgetSpace);
    if (defaultWidget == null) {
      defaultWidget = widgetController.createDefaultWidget(widget, widgetSpace);
    }
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
    /* Controllers */

    StatefulFishWidgetController.class,

    /* Backing Beans */

    StatefulFishWidgetBackingBean.class));
  }

}
