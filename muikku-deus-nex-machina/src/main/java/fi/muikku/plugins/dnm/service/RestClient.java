package fi.muikku.plugins.dnm.service;

import java.lang.reflect.Array;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import fi.muikku.controller.PluginSettingsController;

public class RestClient {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @PostConstruct
  public void init() {
    url = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.url");
    secret = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.secret");
  }
  
  public Document[] listDocuments() {
    return get("/documents", Document[].class);
  }
  
  public Document[] listDocuments(Date since) {
    return get("/documents?since=" + since.getTime(), Document[].class);
  }
  
  public String getDocumentData(Long id) {
    return get("/documents/" + id + "/data", String.class);
  }
  
  private <T> T get(String path, Class<T> type) {
    Client client = getClient();
    try {
      WebTarget target = client.target(url + path);
      Builder request = target.request();
      
      request.accept(MediaType.APPLICATION_JSON_TYPE);
      request.header("Authorization", secret);
      Response response = request.get();
      try {
        return createResponse(response, type);
      } catch (Throwable t) {
        logger.log(Level.SEVERE, "Pyramus GET-request into " + path + " failed", t);
        throw t;
      } finally {
        response.close();
      }
    } finally {
      client.close();
    }
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
  
  private Client getClient() {
    return ClientBuilder.newClient();
  }
  
  private String url;
  private String secret;
}
