package fi.otavanopisto.muikku;

import java.util.ResourceBundle;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.transaction.Transactional;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.events.ContextDestroyedEvent;
import fi.otavanopisto.muikku.events.ContextInitializedEvent;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugins.Plugins;

@WebListener
@Transactional
public class ContextListener implements ServletContextListener {

  @Inject
  private Plugins plugins;

  @Inject
  private LocaleController localeController;

  @Inject
  private Event<ContextInitializedEvent> contextInitializedEvent;

  @Inject
  private Event<ContextDestroyedEvent> contextDestroyedEvent;

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    plugins.initialize();
    // TODO Incorrect place or just a misleading listener name?
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("en")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("en")));
    
    contextInitializedEvent.fire(new ContextInitializedEvent());
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    contextDestroyedEvent.fire(new ContextDestroyedEvent());
  }

}
