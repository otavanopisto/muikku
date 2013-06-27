package fi.muikku.plugins.logout;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ResourceBundle;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.controller.EnvironmentController;
import fi.muikku.controller.UserController;
import fi.muikku.controller.WidgetController;
import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class LogoutPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {

  private static final String LOGOUT_WIDGET_NAME = "logout";

  @Inject
  private WidgetController widgetController;

  @Inject
  private EnvironmentController environmentController;

  @Inject
  private UserController userController;

  @Override
  public String getName() {
    return LOGOUT_WIDGET_NAME;
  }
  
  @Override
  public void init() {
    Widget logoutWidget = widgetController.findWidget(LOGOUT_WIDGET_NAME);
    if (logoutWidget == null) {
      logoutWidget = widgetController.createWidget(LOGOUT_WIDGET_NAME, 1, WidgetVisibility.AUTHENTICATED);
    }
    
    // TODO This is wrong. So wrong. Atrocious, even!
    WidgetLocation widgetLocation = widgetController.findWidgetLocation("environment.header.right");
		if (widgetLocation == null) {
			widgetLocation = widgetController.createWidgetLocation("environment.header.right");
		}
    
    DefaultWidget defaultWidget = widgetController.findDefaultWidget(logoutWidget, widgetLocation);
    if (defaultWidget == null) {
      defaultWidget = widgetController.createDefaultWidget(logoutWidget, widgetLocation);
    }
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        LogoutWidgetBackingBean.class
      ));
  }

  @Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.logout.LogoutPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.logout.LogoutPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
