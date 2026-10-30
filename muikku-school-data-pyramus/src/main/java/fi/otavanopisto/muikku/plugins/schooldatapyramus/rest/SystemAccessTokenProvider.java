package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import java.time.OffsetDateTime;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Singleton
@ApplicationScoped
public class SystemAccessTokenProvider {

  private static final int EXPIRE_SLACK = 60; // refresh one minute before token would expire

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    accessToken = null;
    refreshToken = null;
    accessTokenExpires = null;
    authCode = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME,
        "system.authCode");
    if (StringUtils.isEmpty(authCode)) {
      logger.log(Level.SEVERE, "SystemAuthCode is missing!");
    }
  }

  public String getAccessToken(PyramusRestClient restClient, Client client) {
    if (accessToken == null) {
      AccessToken accessTokenEntity = restClient.createAccessToken(client, authCode);
      accessToken = accessTokenEntity.getAccessToken();
      refreshToken = accessTokenEntity.getRefreshToken();
      accessTokenExpires = OffsetDateTime.now().plusSeconds(accessTokenEntity.getExpiresIn() - EXPIRE_SLACK);
    }
    else if (accessTokenExpires == null || System.currentTimeMillis() > accessTokenExpires.toInstant().toEpochMilli()) {
      refreshAccessToken(restClient, client);
    }
    return accessToken;
  }

  public String refreshAccessToken(PyramusRestClient restClient, Client client) {
    try {
      AccessToken accessTokenEntity = restClient.refreshAccessToken(client, refreshToken);
      accessToken = accessTokenEntity.getAccessToken();
      refreshToken = accessTokenEntity.getRefreshToken();
      accessTokenExpires = OffsetDateTime.now().plusSeconds(accessTokenEntity.getExpiresIn() - EXPIRE_SLACK);
    }
    catch (Exception e) {
      logger.log(Level.INFO, "System access token refresh failure, creating new token");
      AccessToken accessTokenEntity = restClient.createAccessToken(client, authCode);
      accessToken = accessTokenEntity.getAccessToken();
      refreshToken = accessTokenEntity.getRefreshToken();
      accessTokenExpires = OffsetDateTime.now().plusSeconds(accessTokenEntity.getExpiresIn() - EXPIRE_SLACK);
    }
    return accessToken;
  }
  
  private String accessToken;
  private String refreshToken;
  private OffsetDateTime accessTokenExpires;
  private String authCode;

}