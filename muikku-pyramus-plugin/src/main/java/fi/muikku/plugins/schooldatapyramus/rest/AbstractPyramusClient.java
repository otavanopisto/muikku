package fi.muikku.plugins.schooldatapyramus.rest;

import java.lang.reflect.Array;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ContextResolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;

import fi.muikku.controller.PluginSettingsController;
import fi.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

public abstract class AbstractPyramusClient {
  
  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @PostConstruct
  public void clientInit() {
    url = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.url");
    clientId = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.clientId");
    clientSecret = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.clientSecret");
    redirectUrl = pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "rest.redirectUrl");
  }

  public <T> T post(String path, Entity<?> entity, Class<T> type) {
    Client client = createClient();
    
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.post(entity);
    try {
      return createResponse(response, type);
    } finally {
      response.close();
    }
  }
  
  @SuppressWarnings("unchecked")
  public <T> T post(String path, T entity) {
    Client client = createClient();
    
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.post(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return (T) createResponse(response, entity.getClass());
    } finally {
      response.close();
    }
  }
  
  public <T> T get(String path, Class<T> type) {
    Client client = createClient();
    
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.get();
    try {
      return createResponse(response, type);
    } catch (Throwable t) {
      throw t;
    } finally {
      response.close();
    }
  }
  
  protected abstract String getAccessToken();

  protected AccessToken createAccessToken(String code) {
    Client client = createClient();
    
    Form form = new Form()
      .param("grant_type", "authorization_code")
      .param("code", code)
      .param("redirect_uri", redirectUrl)
      .param("client_id", clientId)
      .param("client_secret", clientSecret);

    WebTarget target = client.target(url + "/oauth/token");

    Builder request = target.request();

    return request.post(Entity.form(form), AccessToken.class);
  }

  @SuppressWarnings("unchecked")
  private <T> T createResponse(Response response, Class<T> type) {
    switch (response.getStatus()) {
      case 200:
        return response.readEntity(type);
      case 204:
        if (type.isArray()) {
          return (T) Array.newInstance(type.getComponentType(), 0);
        } else {
          return null;
        }
      case 404:
        return null;
      default:
        throw new RuntimeException("" + response.getStatus() + " - " + response.getEntity());
    }
  }
  
  private Client createClient() {
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

    ClientBuilder builder = clientBuilder.sslContext(sslContext).hostnameVerifier(fakeHostnameVerifier).register(new JacksonConfigurator());
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

  private String url;
  private String clientId;
  private String clientSecret;
  private String redirectUrl;
  
}
