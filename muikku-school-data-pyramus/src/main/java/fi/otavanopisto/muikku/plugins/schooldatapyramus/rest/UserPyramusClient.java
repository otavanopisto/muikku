package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;

import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.CachedEntity;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.cache.UserEntityCache;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusUser;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.session.local.LocalSession;

@SessionScoped
@PyramusUser
class UserPyramusClient implements PyramusClient, Serializable {

  private static final long serialVersionUID = -2643693371146903250L;
  
  private static final int EXPIRE_SLACK = 3;
  
  @Inject
  private ClientPool clientPool;
  
  @Inject
  private UserEntityCache entityCache;
  
  @Inject
  @LocalSession
  private SessionController sessionController;

  @Inject
  private PyramusRestClient restClient;
  
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
    fi.otavanopisto.muikku.session.AccessToken accessToken = sessionController.getOAuthAccessToken("pyramus");
    if (accessToken == null){
      return null;
    }
    Date expires = accessToken.getExpires();   
    if(expires.before(new Date())){
      Client client = obtainClient();
      try {
        synchronized (this) {
          accessToken = sessionController.getOAuthAccessToken("pyramus");
          if (accessToken == null){
            return null;
          }
          expires = accessToken.getExpires();
          if (expires.before(new Date())) {
            AccessToken refreshedAccessToken = restClient.refreshAccessToken(client, accessToken.getRefreshToken());
            Calendar calendar = new GregorianCalendar();
            calendar.setTime(new Date());
            calendar.add(Calendar.SECOND, (refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK));
            sessionController.addOAuthAccessToken("pyramus", calendar.getTime(), refreshedAccessToken.getAccessToken(), refreshedAccessToken.getRefreshToken());
            return refreshedAccessToken.getAccessToken();
          }
          else {
            return accessToken.getToken();
          }
        }
      } finally {
        releaseClient(client);
      }
    }
    return accessToken.getToken();
  }
  
  private Client obtainClient() {
    return clientPool.obtainClient();
  }
  
  private void releaseClient(Client client) {
    clientPool.releaseClient(client);
  }

}
