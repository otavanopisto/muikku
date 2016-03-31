package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.lang.reflect.Array;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Form;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;

@Dependent
class PyramusRestClient implements Serializable {
  
  private static final long serialVersionUID = 1L;

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
  
  public <T> T post(Client client, String accssToken, String path, Entity<?> entity, Class<T> type) {
    
    String blockOutgoing = System.getProperty("muikku.schoolDataPyramus.blockOutgoing", "false");
    
    if ("true".equals(blockOutgoing)) {
      throw new RuntimeException("Outgoing school-data-pyramus traffic blocked");
    }
    
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    Response response = request.post(entity);
    try {
      return createResponse(response, type, path);
    } finally {
      response.close();
    }
  }

  @SuppressWarnings("unchecked")
  public <T> T post(Client client, String accssToken, String path, T entity) {
    WebTarget target = client.target(url + path);

    String blockOutgoing = System.getProperty("muikku.schoolDataPyramus.blockOutgoing", "false");
    
    if ("true".equals(blockOutgoing)) {
      throw new RuntimeException("Outgoing school-data-pyramus traffic blocked");
    }

    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    Response response = request.post(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return (T) createResponse(response, entity.getClass(), path);
    } finally {
      response.close();
    }
  }
  
  public <T> T put(Client client, String accssToken, String path, Entity<?> entity, Class<T> type) {
    
    String blockOutgoing = System.getProperty("muikku.schoolDataPyramus.blockOutgoing", "false");
    
    if ("true".equals(blockOutgoing)) {
      throw new RuntimeException("Outgoing school-data-pyramus traffic blocked");
    }
    
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    Response response = request.put(entity);
    try {
      return createResponse(response, type, path);
    } finally {
      response.close();
    }
  }

  @SuppressWarnings("unchecked")
  public <T> T put(Client client, String accssToken, String path, T entity) {
    WebTarget target = client.target(url + path);

    String blockOutgoing = System.getProperty("muikku.schoolDataPyramus.blockOutgoing", "false");
    
    if ("true".equals(blockOutgoing)) {
      throw new RuntimeException("Outgoing school-data-pyramus traffic blocked");
    }

    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    Response response = request.put(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return (T) createResponse(response, entity.getClass(), path);
    } finally {
      response.close();
    }
  }
  
  public <T> T get(Client client, String accessToken, String path, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    
    request.accept(MediaType.APPLICATION_JSON_TYPE);
    request.header("Authorization", "Bearer " + accessToken);
    Response response = request.get();
    try {
      return createResponse(response, type, path);
    } catch (Throwable t) {
      logger.log(Level.SEVERE, "Pyramus GET-request into " + path + " failed", t);
      return null;
    } finally {
      response.close();
    }
  }

  public void delete(Client client, String accssToken, String path) {
    WebTarget target = client.target(url + path);

    String blockOutgoing = System.getProperty("muikku.schoolDataPyramus.blockOutgoing", "false");
    
    if ("true".equals(blockOutgoing)) {
      throw new RuntimeException("Outgoing school-data-pyramus traffic blocked");
    }

    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    Response response = request.delete();

    switch (response.getStatus()) {
      case 200:
      case 204:
      case 404:
      break;
      
      case 403:
        throw new PyramusRestClientUnauthorizedException(String.format("Received http error %d when requesting %s", response.getStatus(), path));
      default:
        throw new RuntimeException(String.format("Received http error %d (%s) when requesting %s", response.getStatus(), response.getEntity(), path));
    }
  }
  
  public AccessToken createAccessToken(Client client, String code) {
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
  
  public AccessToken refreshAccessToken(Client client, String refreshToken){
    Form form = new Form()
      .param("grant_type", "refresh_token")
      .param("refresh_token", refreshToken)
      .param("redirect_uri", redirectUrl)
      .param("client_id", clientId)
      .param("client_secret", clientSecret);

    WebTarget target = client.target(url + "/oauth/token");

    Builder request = target.request();

    return request.post(Entity.form(form), AccessToken.class);
  }

  @SuppressWarnings("unchecked")
  private <T> T createResponse(Response response, Class<T> type, String path) {
    switch (response.getStatus()) {
      case 200:
        return response.readEntity(type);
      case 204:
        if (type.isArray()) {
          return (T) Array.newInstance(type.getComponentType(), 0);
        } else {
          return null;
        }
      case 403:
        throw new PyramusRestClientUnauthorizedException(String.format("Received http error %d (%s) when requesting %s", response.getStatus(), response.getEntity(), path));
      case 404:
        return null;
      default:
        throw new RuntimeException(String.format("Received http error %d (%s) when requesting %s", response.getStatus(), response.getEntity(), path));
    }
  }
  
  private String url;
  private String clientId;
  private String clientSecret;
  private String redirectUrl;
}
