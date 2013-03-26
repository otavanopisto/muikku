package fi.muikku;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import fi.muikku.plugins.Plugins;

@WebListener
public class PluginLoadListener implements ServletContextListener {

  @Inject
  private Plugins plugins;
  
  @Override
  public void contextInitialized(ServletContextEvent sce) {
  	plugins.initialize();
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {

  }

}
