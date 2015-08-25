package fi.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Lock;
import javax.ejb.LockType;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.ext.ContextResolver;

import org.jboss.resteasy.client.jaxrs.cache.BrowserCacheFeature;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.plugins.schooldatapyramus.rest.qualifier.PyramusUser;
import fi.muikku.session.SessionController;
import fi.muikku.session.local.LocalSession;

@Lock(LockType.WRITE)
@SessionScoped
@PyramusUser
class UserPyramusClient implements PyramusClient, Serializable {

  private static final long serialVersionUID = -2643693371146903250L;
  
  private static final int EXPIRE_SLACK = 3;
  
  @Inject
  private Logger logger;

  @Inject
  @LocalSession
  private SessionController sessionController;

  @Inject
  private PyramusRestClient restClient;
  
  @PostConstruct
  public void init() {
    pooledClients = new ArrayList<>();
  }

  @PreDestroy
  public void deinit() {
    for (Client pooledClient : pooledClients) {
      pooledClient.close();
    }
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
  public <T> T get(String path, Class<T> type) {
    Client client = obtainClient();
    try {
      return restClient.get(client, getAccessToken(), path, type);
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
    fi.muikku.session.AccessToken accessToken = sessionController.getOAuthAccessToken("pyramus");
    
    if(accessToken == null){
      return null;
    }
    
    Client client = obtainClient();
    try {
      Date expires = accessToken.getExpires();   
      if(expires.before(new Date())){
        AccessToken refreshedAccessToken = restClient.refreshAccessToken(client, accessToken.getRefreshToken());
        Calendar calendar = new GregorianCalendar();
        calendar.setTime(new Date());
        calendar.add(Calendar.SECOND, (refreshedAccessToken.getExpiresIn() - EXPIRE_SLACK));
        sessionController.addOAuthAccessToken("pyramus", calendar.getTime(), refreshedAccessToken.getAccessToken(), refreshedAccessToken.getRefreshToken());
        return refreshedAccessToken.getAccessToken();
      }
      
      return accessToken.getToken();
    } finally {
      releaseClient(client);
    }
  }

  private Client obtainClient() {
    if (pooledClients.isEmpty()) {
      return buildClient();
    }
    
    return pooledClients.remove(pooledClients.size() - 1);
  }

  private void releaseClient(Client client) {
    pooledClients.add(client);
  }
  
  private List<Client> pooledClients;
  
  private Client buildClient() {
    // TODO: trust all only on development environment

    ClientBuilder clientBuilder = ClientBuilder.newBuilder();
    
    TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
      public java.security.cert.X509Certificate[] getAcceptedIssuers() {
        return null;
      }

      public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
      }

      public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
      }
    } };

    SSLContext sslContext = null;
    try {
      sslContext = SSLContext.getInstance("SSL");
      sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
    } catch (NoSuchAlgorithmException | KeyManagementException e) {
      logger.log(Level.SEVERE, "Failed to initialize trust all certificate manager", e);
    }

    HostnameVerifier fakeHostnameVerifier = new HostnameVerifier() {
      @Override
      public boolean verify(String hostname, SSLSession session) {
        return true;
      }
    };
    
    ClientBuilder builder = clientBuilder
        .sslContext(sslContext)
        .hostnameVerifier(fakeHostnameVerifier)
        .register(new JacksonConfigurator())
        .register(new BrowserCacheFeature());
    
    return builder.build();
  }


  private class JacksonConfigurator implements ContextResolver<ObjectMapper> {

    @Override
    public ObjectMapper getContext(Class<?> type) {
      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JodaModule());
      objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
      
      return objectMapper;
    }
  }

}
