package fi.muikku;

import java.util.ResourceBundle;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBackingBean;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugins.Plugins;

@WebListener
public class PluginLoadListener implements ServletContextListener {

  @Inject
  private Plugins plugins;

  @Inject
  private LocaleBackingBean localeBackingBean;

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    plugins.initialize();
    // TODO Incorrect place or just a misleading listener name?
    localeBackingBean.add(LocaleLocation.GLOBAL, ResourceBundle.getBundle("fi.muikku.i18n.GlobalMessages", LocaleUtils.toLocale("fi")));
    localeBackingBean.add(LocaleLocation.GLOBAL, ResourceBundle.getBundle("fi.muikku.i18n.GlobalMessages", LocaleUtils.toLocale("en")));
    localeBackingBean.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("fi")));
    localeBackingBean.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("en")));
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {

  }

}
