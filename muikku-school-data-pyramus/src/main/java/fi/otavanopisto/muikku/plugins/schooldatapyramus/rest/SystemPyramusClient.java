package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import javax.annotation.PostConstruct;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.CachedEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.SystemEntityCache;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusSystem;

@ApplicationScoped
@PyramusSystem
@Singleton
@Lock (LockType.WRITE)
class SystemPyramusClient implements PyramusClient {
  
  @Inject
  private ClientPool clientPool;

  @Inject
  private PyramusRestClient restClient;
  
  @Inject
  private SystemEntityCache entityCache;
  
  @Inject
  private SystemAccessTokenProvider systemAccessTokenProvider;

  @PostConstruct
  public void init() {
    
  }

  @Override
  public <T> T post(String path, Entity<?> entity, Class<T> type) {
    Client client = obtainClient();
    try {
      return restClient.post(client, getAccessToken(), path, entity, type);
    } finally {
      releaseClient(client);
    }
  }

  @Override
  public <T> T post(String path, T entity) {
    Client client = obtainClient();
    try {
      return restClient.post(client, getAccessToken(), path, entity);
    } finally {
      releaseClient(client);
    }
  }
  
  @Override
  public <T> T put(String path, Entity<?> entity, Class<T> type) {
    Client client = obtainClient();
    try {
      return restClient.put(client, getAccessToken(), path, entity, type);
    } finally {
      releaseClient(client);
    }
  }

  @Override
  public <T> T put(String path, T entity) {
    Client client = obtainClient();
    try {
      return restClient.put(client, getAccessToken(), path, entity);
    } finally {
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
      if (result != null) {
        entityCache.put(path, result);
      }
      
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
      releaseClient(client);
    }
  }
  
  private String getAccessToken() {
    Client client = obtainClient();
    try {
      return systemAccessTokenProvider.getAccessToken(restClient, client);
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
}
