package fi.muikku.plugins.schooldatapyramus.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Singleton
@ApplicationScoped
public class SystemAccessTokenProvider {

  private static final int EXPIRE_SLACK = 3;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    accessToken = null;
    refreshToken = null;
    accessTokenExpires = null;
    authCode = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "system.authCode");
    if(StringUtils.isEmpty(authCode)){
      logger.log(Level.SEVERE, "SystemAuthCode is missing!");
    }
  }
  
  public String getAccessToken(PyramusRestClient restClient, Client client) {
    if (accessToken == null) {
      AccessToken createdAccessToken = restClient.createAccessToken(client, authCode);
      accessToken = createdAccessToken.getAccessToken();
      refreshToken = createdAccessToken.getRefreshToken();
      accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
    } else {
      if ((accessTokenExpires == null) || (System.currentTimeMillis() > accessTokenExpires.getMillis())) {
        AccessToken refreshedAccessToken = restClient.refreshAccessToken(client, refreshToken);
        accessToken = refreshedAccessToken.getAccessToken();
        accessTokenExpires = new DateTime().plusSeconds(refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK);
      }
    }

    return accessToken;
  }
  
  private String accessToken;
  private String refreshToken;
  private DateTime accessTokenExpires;
  private String authCode;
}
