package fi.muikku;

import java.util.ResourceBundle;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleController;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugins.Plugins;

@WebListener
public class PluginLoadListener implements ServletContextListener {

  @Inject
  private Plugins plugins;

  @Inject
  private LocaleController localeController;

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    plugins.initialize();
    // TODO Incorrect place or just a misleading listener name?
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("en")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("en")));
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {

  }

}
