package fi.otavanopisto.muikku.plugins.dnm.service;

import java.lang.reflect.Array;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import fi.otavanopisto.muikku.controller.PluginSettingsController;

public class RestClient {
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  public Document getDocument(Long id) {
    return get("/documents/" + id, Document.class);
  }
  
  public Document[] listDocuments() {
    return get("/documents", Document[].class);
  }
  
  public Document[] listDocuments(Date since) {
    return get("/documents?since=" + since.getTime(), Document[].class);
  }
  
  public String getDocumentData(Long id) {
    String url = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.url");
    String secret = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.secret");
    String path = "/documents/" + id + "/data";
    
    Client client = getClient();
    try {
      WebTarget target = client.target(url + path);
      Builder request = target.request();
      
      request.header("Authorization", secret);
      Response response = request.get();
      try {
        switch (response.getStatus()) {
          case 200:
            return response.readEntity(String.class);
          default:
            logger.log(Level.WARNING, String.format("GET-request into %s failed with status code %d", path, response.getStatus()));
          break;
        }
        
        return null;
      } catch (Throwable t) {
        logger.log(Level.SEVERE, "GET-request into " + path + " failed", t);
      } finally {
        response.close();
      }
    } finally {
      client.close();
    }
    
    return null;
  }
  
  private <T> T get(String path, Class<T> type) {
    String url = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.url");
    String secret = pluginSettingsController.getPluginSetting("deus-nex-machina", "service.secret");
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
        logger.log(Level.SEVERE, "GET-request into " + path + " failed", t);
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
        logger.log(Level.SEVERE, String.format("Could not process responce (status: %d, entity: %s)", response.getStatus(), response.getEntity()));
        return null;
    }
  }
  
  private Client getClient() {
    return ClientBuilder.newClient();
  }
}
