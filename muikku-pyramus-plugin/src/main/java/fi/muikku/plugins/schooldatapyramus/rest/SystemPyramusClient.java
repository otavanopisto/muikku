package fi.muikku.plugins.schooldatapyramus.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.plugins.schooldatapyramus.SystemOauthController;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;

  @Inject
  private SystemOauthController systemOauthController;

  @PostConstruct
  public void init() {
    accessToken = null;
    accessTokenExpires = null;
    pooledClients = new ArrayList<>();
    authCode = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "system.authCode");
    if(StringUtils.isEmpty(authCode)){
      logger.log(Level.SEVERE, "SystemAuthCode is missing!");
    }
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
  }

  @Override
  protected synchronized String getAccessToken() {

    SystemAccessToken systemAccessToken = systemOauthController.getSystemAccessToken();
    if (systemAccessToken == null) {
      AccessToken createdAccessToken = createAccessToken(authCode);
      accessToken = createdAccessToken.getAccessToken();
      accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
      systemOauthController.createSystemAccessToken(accessToken, accessTokenExpires.getMillis(), createdAccessToken.getRefreshToken());
    } else {
      if (System.currentTimeMillis() > systemAccessToken.getExpires()) {
        AccessToken refreshedAccessToken = refreshAccessToken(systemAccessToken.getRefreshToken());
        accessToken = refreshedAccessToken.getAccessToken();
        accessTokenExpires = new DateTime().plusSeconds(refreshedAccessToken.getExpiresIn());
        systemOauthController.refreshSystemAccessToken(systemAccessToken, accessToken, accessTokenExpires.getMillis());
      } else {
        accessToken = systemAccessToken.getAccessToken();
        accessTokenExpires = new DateTime(systemAccessToken.getExpires());
      }
    }

    return accessToken;
  }

  @Override
  protected synchronized Client obtainClient() {
    if (pooledClients.isEmpty()) {
      return buildClient();
    }

    return pooledClients.remove(pooledClients.size() - 1);
  }

  @Override
  protected synchronized void releaseClient(Client client) {
    pooledClients.add(client);
  }

  private List<Client> pooledClients;
  private String accessToken;
  private DateTime accessTokenExpires;
  private String authCode;
}
