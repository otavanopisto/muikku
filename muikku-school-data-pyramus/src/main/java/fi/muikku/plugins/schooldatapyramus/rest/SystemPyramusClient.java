package fi.muikku.plugins.schooldatapyramus.rest;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;

import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.muikku.plugins.schooldatapyramus.SystemOauthController;
import fi.muikku.plugins.schooldatapyramus.model.SystemAccessToken;
import fi.muikku.plugins.schooldatapyramus.rest.cache.CachedEntity;
import fi.muikku.plugins.schooldatapyramus.rest.cache.EntityCacheEvictor;
import fi.muikku.plugins.schooldatapyramus.rest.cache.SystemEntityCache;
import fi.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusSystem;

@ApplicationScoped
@PyramusSystem
@Singleton
@Lock (LockType.WRITE)
class SystemPyramusClient implements PyramusClient {

  private static final int EXPIRE_SLACK = 3;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private Logger logger;
  
  @Inject
  private ClientPool clientPool;

  @Inject
  private PyramusRestClient restClient;
  
  @Inject
  private SystemEntityCache entityCache;
  
  @Inject
  private EntityCacheEvictor entityCacheEvictor;

  @Inject
  private SystemOauthController systemOauthController;
  
  @PostConstruct
  public void init() {
    accessToken = null;
    accessTokenExpires = null;
    authCode = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "system.authCode");
    if(StringUtils.isEmpty(authCode)){
      logger.log(Level.SEVERE, "SystemAuthCode is missing!");
    }
  }

  @Override
  public <T> T post(String path, Entity<?> entity, Class<T> type) {
    Client client = obtainClient();
    try {
      return restClient.post(client, getAccessToken(), path, entity, type);
    } finally {
      entityCacheEvictor.evictPath(path);
      releaseClient(client);
    }
  }

  @Override
  public <T> T post(String path, T entity) {
    Client client = obtainClient();
    try {
      return restClient.post(client, getAccessToken(), path, entity);
    } finally {
      entityCacheEvictor.evictPath(path);
      releaseClient(client);
    }
  }
  
  @Override
  public <T> T put(String path, Entity<?> entity, Class<T> type) {
    Client client = obtainClient();
    try {
      return restClient.put(client, getAccessToken(), path, entity, type);
    } finally {
      entityCacheEvictor.evictPath(path);
      releaseClient(client);
    }
  }

  @Override
  public <T> T put(String path, T entity) {
    Client client = obtainClient();
    try {
      return restClient.put(client, getAccessToken(), path, entity);
    } finally {
      entityCacheEvictor.evictPath(path);
      releaseClient(client);
    }
  }

  @Override
  // TODO: Maybe Lock(READ)?
  public <T> T get(String path, Class<T> type) {
    Client client = obtainClient();
    try {
      CachedEntity<T> cachedEntity = entityCache.get(path, type);
      if (cachedEntity != null) {
        return cachedEntity.getData();
      }
      
      T result = restClient.get(client, getAccessToken(), path, type);
      entityCache.put(path, result);
      
      return result;
    } finally {
      releaseClient(client);
    }
  }

  @Override
  public void delete(String path) {
    Client client = obtainClient();
    try {
      restClient.delete(client, getAccessToken(), path);      
    } finally {
      entityCacheEvictor.evictPath(path);
      releaseClient(client);
    }
  }
  
  private String getAccessToken() {
    Client client = obtainClient();
    try {
      SystemAccessToken systemAccessToken = systemOauthController.getSystemAccessToken();
      if (systemAccessToken == null) {
        AccessToken createdAccessToken = restClient.createAccessToken(client, authCode);
        accessToken = createdAccessToken.getAccessToken();
        accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
        systemOauthController.createSystemAccessToken(accessToken, accessTokenExpires.getMillis(), createdAccessToken.getRefreshToken());
      } else {
        if (System.currentTimeMillis() > systemAccessToken.getExpires()) {
          AccessToken refreshedAccessToken = restClient.refreshAccessToken(client, systemAccessToken.getRefreshToken());
          accessToken = refreshedAccessToken.getAccessToken();
          accessTokenExpires = new DateTime().plusSeconds(refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK);
          systemOauthController.refreshSystemAccessToken(systemAccessToken, accessToken, accessTokenExpires.getMillis());
        } else {
          accessToken = systemAccessToken.getAccessToken();
          accessTokenExpires = new DateTime(systemAccessToken.getExpires());
        }
      }
  
      return accessToken;
    } finally {
      releaseClient(client);
    }
  }

  private Client obtainClient() {
    return clientPool.obtainClient();
  }
  
  private void releaseClient(Client client) {
    clientPool.releaseClient(client);
  }

  private String accessToken;
  private DateTime accessTokenExpires;
  private String authCode;
}
