package fi.muikku;

import java.util.ResourceBundle;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.transaction.Transactional;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.events.ContextDestroyedEvent;
import fi.muikku.events.ContextInitializedEvent;
import fi.muikku.i18n.LocaleController;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugins.Plugins;

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
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.i18n.JavaScriptMessages", LocaleUtils.toLocale("en")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.i18n.ApplicationMessages", LocaleUtils.toLocale("en")));
    
    contextInitializedEvent.fire(new ContextInitializedEvent());
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {
    contextDestroyedEvent.fire(new ContextDestroyedEvent());
  }

}
