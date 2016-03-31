package fi.otavanopisto.muikku.rest;

import java.util.ResourceBundle;

import javax.inject.Inject;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.i18n.LocaleLocation;

@WebListener
public class LocaleLoadListener implements ServletContextListener {

  @Inject
  private LocaleController localeController;

  @Override
  public void contextInitialized(ServletContextEvent sce) {
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.rest.workspace.WorkspaceRestMessages", LocaleUtils.toLocale("fi")));
    localeController.add(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.otavanopisto.muikku.rest.workspace.WorkspaceRestMessages", LocaleUtils.toLocale("en")));
  }

  @Override
  public void contextDestroyed(ServletContextEvent sce) {

  }

}
