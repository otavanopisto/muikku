package fi.muikku.plugins.schooldatapyramus.rest;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Level;
import java.util.logging.Logger;

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

public abstract class AbstractPyramusClient {
  
  // TODO: replace with configured values
  private static final String PYRAMUS_REST = "https://localhost:8443/1";
  private static String CLIENT_ID = "854885cf-2284-4b17-b63c-a8b189535f8d";
  private static String CLIENT_SECRET = "cqJ4J1if8ca5RMUqaYyFPYToxfFxt2YT8PXL3pNygPClnjJdt55lrFs6k1SZ6colJN24YEtZ7bhFW29S";
  private static String REDIRECT_URL = "https://localhost:8443/oauth2ClientTest/success";
  
  @Inject
  private Logger logger;

  public <T> T post(String path, Entity<?> entity, Class<T> type) {
    Client client = createClient();
    
    WebTarget target = client.target(PYRAMUS_REST + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.post(entity);
    try {
      return response.readEntity(type);
    } finally {
      response.close();
    }
  }
  
  public <T> T post(String path, Object entity, Class<T> type) {
    Client client = createClient();
    
    WebTarget target = client.target(PYRAMUS_REST + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.post(Entity.entity(entity, MediaType.APPLICATION_JSON));
    try {
      return response.readEntity(type);
    } finally {
      response.close();
    }
  }
  
  public <T> T get(String path, Class<T> type) {
    Client client = createClient();
    
    WebTarget target = client.target(PYRAMUS_REST + path);
    Builder request = target.request();
    request.header("Authorization", "Bearer " + getAccessToken());
    Response response = request.get();
    try {
      return response.readEntity(type);
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
      .param("redirect_uri", REDIRECT_URL)
      .param("client_id", CLIENT_ID)
      .param("client_secret", CLIENT_SECRET);

    WebTarget target = client.target(PYRAMUS_REST + "/oauth/token");

    Builder request = target.request();

    return request.post(Entity.form(form), AccessToken.class);
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

  
  
}
