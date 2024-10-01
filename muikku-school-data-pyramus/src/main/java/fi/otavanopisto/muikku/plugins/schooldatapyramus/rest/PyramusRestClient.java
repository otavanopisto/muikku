package fi.otavanopisto.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;
import java.lang.reflect.Array;
import java.util.Locale;
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

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.schooldata.BridgeResponse;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeException;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeUnauthorizedException;

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
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
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
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.post(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return (T) createResponse(response, entity.getClass(), path);
    } finally {
      response.close();
    }
  }
  
  public <T> T put(Client client, String accssToken, String path, Entity<?> entity, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
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
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.put(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return (T) createResponse(response, entity.getClass(), path);
    } finally {
      response.close();
    }
  }

  public <T> BridgeResponse<T> responseGet(Client client, String accessToken, String path, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.accept(MediaType.APPLICATION_JSON_TYPE);
    request.header("Authorization", "Bearer " + accessToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.get();
    try {
      return createBridgeResponse(response, path, type);
    }
    finally {
      response.close();
    }
  }

  public <T> BridgeResponse<T> responsePut(Client client, String accessToken, String path, Entity<?> payload, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.accept(MediaType.APPLICATION_JSON_TYPE);
    request.header("Authorization", "Bearer " + accessToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.put(payload);
    try {
      return createBridgeResponse(response, path, type);
    }
    finally {
      response.close();
    }
  }
  
  public <T> BridgeResponse<T> responsePost(Client client, String accessToken, String path, Entity<?> payload, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.accept(MediaType.APPLICATION_JSON_TYPE);
    request.header("Authorization", "Bearer " + accessToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.post(payload);
    try {
      return createBridgeResponse(response, path, type);
    }
    finally {
      response.close();
    }
  }
  
  public <T> T get(Client client, String accessToken, String path, Class<T> type) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.accept(MediaType.APPLICATION_JSON_TYPE, MediaType.TEXT_PLAIN_TYPE);
    request.header("Authorization", "Bearer " + accessToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.get();
    try {
      return createResponse(response, type, path);
    } finally {
      response.close();
    }
  }

  public void delete(Client client, String accssToken, String path) {
    WebTarget target = client.target(url + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + accssToken);
    if (locale != null) {
      request.header("Accept-Language", locale);
    }
    Response response = request.delete();

    try {
      switch (response.getStatus()) {
        case 200:
        case 204:
        case 404:
        break;
        case 403:
          logger.warning(String.format("Pyramus DELETE for path %s unauthorized (%d)", path, response.getStatus()));
          throw new SchoolDataBridgeUnauthorizedException(String.format("Received http error %d when requesting %s", response.getStatus(), path));
        default:
          logger.warning(String.format("Pyramus DELETE for path %s failed (%d)", path, response.getStatus()));
          throw new SchoolDataBridgeException(response.getStatus(), String.format("Received http error %d (%s) when requesting %s", response.getStatus(), response.getEntity(), path));
      }
    }
    finally {
      response.close();
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
    int statusCode = response.getStatus();
    switch (statusCode) {
      case 200:
        return response.readEntity(type);
      case 204:
        if (type.isArray()) {
          return (T) Array.newInstance(type.getComponentType(), 0);
        }
        else {
          return null;
        }
      case 403:
        logger.warning(String.format("Pyramus call for path %s unauthorized (%d)", path, statusCode));
        throw new SchoolDataBridgeUnauthorizedException(String.format("Received http error %d (%s) when requesting %s", statusCode, response.getEntity(), path));
      case 404:
        return null;
      default:
        String responseContent = response.hasEntity() ? response.readEntity(String.class) : null; // note: response now closed
        logger.warning(String.format("Pyramus call for path %s failed: %d %s",
            path,
            statusCode,
            StringUtils.defaultIfEmpty(responseContent, "")));
        throw new SchoolDataBridgeException(statusCode, String.format("Received http error %d (%s) when requesting %s", statusCode, responseContent, path));
    }
  }
  
  @SuppressWarnings("unchecked")
  private <T> BridgeResponse<T> createBridgeResponse(Response response, String path, Class<T> type) {
    int statusCode = response.getStatus();
    String responseContent = response.hasEntity() ? response.readEntity(String.class) : null; // note: response now closed
    T entity = null;
    String message = null;
    if (responseContent != null && statusCode >= 200 && statusCode < 300) {
      // ok response with entity 
      try {
        entity = new ObjectMapper().registerModule(new JavaTimeModule()).readValue(responseContent, type);
      }
      catch (Exception e) {
        logger.log(Level.SEVERE, String.format("Failed to deserialize path %s entity %s from %s", path, type.getSimpleName(), responseContent), e);
        statusCode = 500;
      }
    }
    else if (statusCode == 204 && type.isArray()) {
      // no content response for arrays (empty array)
      entity = (T) Array.newInstance(type.getComponentType(), 0);
    }
    else if (responseContent != null) {
      // error response, assume content to be message
      message = responseContent;
      if (statusCode != 403 && statusCode != 404) {
        logger.warning(String.format("Pyramus call for path %s failed: %d %s",
            path,
            statusCode,
            StringUtils.defaultIfEmpty(message, "")));
      }
    }
    return new BridgeResponse<T>(statusCode, entity, message);
  }
  
  public void setLocale(Locale locale) {
    this.locale = locale;
  }

  private String url;
  private String clientId;
  private String clientSecret;
  private String redirectUrl;
  private Locale locale;
}
