package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.apache.commons.lang3.StringUtils;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

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
      accessTokenExpires = OffsetDateTime.now().plusSeconds(createdAccessToken.getExpiresIn());
    } else {
      if ((accessTokenExpires == null) || (System.currentTimeMillis() > accessTokenExpires.toInstant().toEpochMilli())) {
        AccessToken refreshedAccessToken = restClient.refreshAccessToken(client, refreshToken);
        accessToken = refreshedAccessToken.getAccessToken();
        accessTokenExpires = OffsetDateTime.now().plusSeconds(refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK);
      }
    }

    return accessToken;
  }
  
  private String accessToken;
  private String refreshToken;
  private OffsetDateTime accessTokenExpires;
  private String authCode;
}
