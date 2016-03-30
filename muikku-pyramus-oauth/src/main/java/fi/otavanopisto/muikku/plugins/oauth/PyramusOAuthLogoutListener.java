package fi.otavanopisto.muikku.plugins.oauth;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.events.LogoutEvent;

@ApplicationScoped
public class PyramusOAuthLogoutListener {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  public void onLogoutEvent(@Observes LogoutEvent event) {
    FacesContext facesContext = FacesContext.getCurrentInstance();
    if (facesContext != null) {
      ExternalContext externalContext = facesContext.getExternalContext();
      if (externalContext != null) {
        try {
          String logoutUrl = pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.logoutUrl");
          if (StringUtils.isNotBlank(logoutUrl)) {
            externalContext.redirect(logoutUrl);
          }
        } catch (IOException e) {
          logger.log(Level.SEVERE, "Could not redirect browser into Pyramus logout URL", e);
        }
      }
    }
  }
  
}
