package fi.otavanopisto.muikku.plugins.fish;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.controller.WidgetController;
import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.model.widgets.DefaultWidget;
import fi.otavanopisto.muikku.model.widgets.Widget;
import fi.otavanopisto.muikku.model.widgets.WidgetSpace;
import fi.otavanopisto.muikku.model.widgets.WidgetVisibility;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PersistencePluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.plugins.fish.dao.FishMessageDAO;
import fi.otavanopisto.muikku.plugins.fish.model.FishMessage;

@ApplicationScoped
@Stateful
public class DatabaseFishPluginDescriptor implements PluginDescriptor,
                                                     PersistencePluginDescriptor,
                                                     LocalizedPluginDescriptor {

  private static final String FISH_WIDGET_LOCATION = "environment.header.right";
  private static final String FISH_WIDGET_NAME = "databasefish";
  private static final String FISH_ADMIN_WIDGET_LOCATION = "plugin-settings.content-sidebar.left";
  private static final String FISH_ADMIN_WIDGET_NAME = "fishadmin";
  private static final Integer FISH_WIDGET_MINIMUM_SIZE = 8; 
  private static final Integer FISH_ADMIN_MINIMUM_SIZE = 4; 

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "databasefish";
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
    
    Widget adminWidget = widgetController.findWidget(FISH_ADMIN_WIDGET_NAME);
    if (adminWidget == null) {
      adminWidget = widgetController.createWidget(FISH_ADMIN_WIDGET_NAME,
                                                  FISH_ADMIN_MINIMUM_SIZE,
                                                  WidgetVisibility.AUTHENTICATED);
    }

    WidgetSpace adminWidgetSpace = widgetController.findWidgetSpace(FISH_ADMIN_WIDGET_LOCATION);
    if (adminWidgetSpace == null) { // TODO: In a perfect world, there would be no null checks
      adminWidgetSpace = widgetController.createWidgetSpace(FISH_ADMIN_WIDGET_LOCATION);
    }

    DefaultWidget adminDefaultWidget = widgetController.findDefaultWidget(adminWidget, adminWidgetSpace);
    if (adminDefaultWidget == null) {
      adminDefaultWidget = widgetController.createDefaultWidget(adminWidget, adminWidgetSpace);
    }
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        
    /* DAOs */
        
    FishMessageDAO.class,
        
    /* Controllers */

    DatabaseFishWidgetController.class,

    /* Backing Beans */

    DatabaseFishWidgetBackingBean.class));
  }

  @Override
  public Class<?>[] getEntities() {
    return new Class<?>[] {
      FishMessage.class,
    };
  }
  
  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.fish.DatabaseFishPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.fish.DatabaseFishPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
