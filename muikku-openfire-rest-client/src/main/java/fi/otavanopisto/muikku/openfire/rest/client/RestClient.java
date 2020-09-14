package fi.otavanopisto.muikku.openfire.rest.client;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.HttpMethod;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.ContextResolver;

import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationMode;
import fi.otavanopisto.muikku.openfire.rest.client.entity.AuthenticationToken;
import fi.otavanopisto.muikku.openfire.rest.client.exception.ErrorResponse;

/**
 * The Class RestClient.
 */
public final class RestClient {

  /** The Constant LOG. */
  private static final Logger LOG = Logger.getLogger(RestClient.class.getName());

  /** The uri. */
  private String baseURI;

  /** The token. */
  private AuthenticationToken token;

  /** The password. */
  private String password;

  /** The connection timeout. */
  private int connectionTimeout;

  /** The headers. */
  private MultivaluedMap<String, Object> headers;

  /**
   * Gets the.
   *
   * @param <T>
   *            the generic type
   * @param restPath
   *            the rest path
   * @param expectedResponse
   *            the expected response
   * @param queryParams
   *            the query params
   * @return the t
   */
  public <T> T get(String restPath, Class<T> expectedResponse, Map<String, String> queryParams) {
    return call(HttpMethod.GET, restPath, expectedResponse, null, queryParams);
  }

  /**
   * Post.
   *
   * @param restPath
   *            the rest path
   * @param payload
   *            the payload
   * @param queryParams
   *            the query params
   * @return the response
   */
  public Response post(String restPath, Object payload, Map<String, String> queryParams) {
    LOG.log(Level.INFO, "POST: {0}", restPath);
    return call(HttpMethod.POST, restPath, Response.class, payload, queryParams);
  }

  /**
   * Put.
   *
   * @param restPath
   *            the rest path
   * @param payload
   *            the payload
   * @param queryParams
   *            the query params
   * @return the response
   */
  public Response put(String restPath, Object payload, Map<String, String> queryParams) {
    LOG.log(Level.INFO, "PUT: {0}", restPath);
    return call(HttpMethod.PUT, restPath, Response.class, payload, queryParams);
  }

  /**
   * Delete.
   *
   * @param restPath
   *            the rest path
   * @param queryParams
   *            the query params
   * @return the response
   */
  public Response delete(String restPath, Map<String, String> queryParams) {
    LOG.log(Level.INFO, "DELETE: {0}", restPath);
    return call(HttpMethod.DELETE, restPath, Response.class, null, queryParams);
  }

  /**
   * Gets the.
   *
   * @param <T>
   *            the generic type
   * @param methodName
   *            the method name
   * @param restPath
   *            the rest path
   * @param expectedResponse
   *            the clazz
   * @param payload
   *            the payload
   * @param queryParams
   *            the query params
   * @return the t
   */
  @SuppressWarnings("unchecked")
  public <T> T call(String methodName, String restPath, Class<T> expectedResponse, Object payload,
      Map<String, String> queryParams) {
    WebTarget webTarget = createWebTarget(restPath, queryParams);

    Response result = webTarget.request().headers(headers).method(
        methodName.toString(),
        Entity.entity(payload, MediaType.APPLICATION_XML),
        Response.class);

    if (expectedResponse.getName().equals(Response.class.getName())) {
      return (T) result;
    }
    
    // Return 404 as null
    if (result != null && result.getStatus() == Status.NOT_FOUND.getStatusCode()) {
      return null;
    }

    if (result != null && result.hasEntity() && isStatusCodeOK(result, restPath)) {
      return (T) result.readEntity(expectedResponse);
    }

    return null;
  }

  /**
   * Checks if is status code ok.
   *
   * @param response
   *            the response
   * @param uri
   *            the uri
   * @return true, if is status code ok
   */
  private boolean isStatusCodeOK(Response response, String uri) {
    if (response.getStatus() == Status.OK.getStatusCode()
        || response.getStatus() == Status.CREATED.getStatusCode()) {
      return true;
    } else if (response.getStatus() == Status.UNAUTHORIZED.getStatusCode()) {
      LOG.log(Level.SEVERE, 
          "UNAUTHORIZED: Your credentials are wrong. Please check your username/password or the secret key");
    } else if (response.getStatus() == Status.CONFLICT.getStatusCode()
        || response.getStatus() == Status.NOT_FOUND.getStatusCode()
        || response.getStatus() == Status.FORBIDDEN.getStatusCode()
        || response.getStatus() == Status.BAD_REQUEST.getStatusCode()) {
      ErrorResponse errorResponse = response.readEntity(ErrorResponse.class);
      LOG.log(Level.SEVERE, "{0} - {1} on ressource {2}", new Object[] {errorResponse.getException(), errorResponse.getMessage(), errorResponse.getRessource()});
    } else {
      LOG.log(Level.SEVERE, "Unsupported status code: " + response);
    }
    LOG.log(Level.SEVERE, response.toString());

    return false;
  }

  /**
   * Creates the web target.
   *
   * @param restPath
   *            the rest path
   * @param queryParams
   *            the query params
   * @return the web target
   */
  private WebTarget createWebTarget(String restPath, Map<String, String> queryParams) {
    WebTarget webTarget;
    try {
      URI u = new URI(this.baseURI + "/plugins/restapi/v1/" + restPath);
      Client client = createrRestClient();

      webTarget = client.target(u);
      if (queryParams != null && !queryParams.isEmpty()) {
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
          if (entry.getKey() != null && entry.getValue() != null) {
            LOG.log(Level.INFO, "PARAM: {0} = {1}", new Object[] {entry.getKey(), entry.getValue()});
            webTarget = webTarget.queryParam(entry.getKey(), entry.getValue());
          }
        }
      }

    } catch (Exception e) {
      LOG.log(Level.SEVERE, "Error", e);
      return null;
    }

    return webTarget;
  }

  /**
   * The Constructor.
   *
   * @param builder
   *            the builder
   */
  private RestClient(RestClientBuilder builder) {
    this.baseURI = builder.baseURI;
    this.connectionTimeout = builder.connectionTimeout;
    this.setHeaders(builder.headers);
    this.token = builder.token;
  }

  /**
   * Creater rest client.
   *
   * @return the client
   * @throws KeyManagementException
   *             the key management exception
   * @throws NoSuchAlgorithmException
   *             the no such algorithm exception
   */
  private Client createrRestClient() throws KeyManagementException, NoSuchAlgorithmException {
    ClientBuilder clientBuilder = ClientBuilder.newBuilder();

    ClientBuilder builder = clientBuilder
        .register(new JacksonConfigurator());
    
    return builder.build();
  }

  /**
   * The Class Builder.
   */
  public static class RestClientBuilder {

    /** The uri. */
    private String baseURI;

    /** The connection timeout. */
    private int connectionTimeout;

    /** The headers. */
    private MultivaluedMap<String, Object> headers;

    /** The token. */
    private AuthenticationToken token;

    /**
     * The Constructor.
     *
     * @param baseUri
     *            the base uri
     */
    public RestClientBuilder(String baseUri) {
      this.headers = new MultivaluedHashMap<String, Object>();
      this.baseURI = baseUri;
    }

    /**
     * Connection timeout.
     *
     * @param connectionTimeout
     *            the connection timeout
     * @return the builder
     */
    public RestClientBuilder connectionTimeout(int connectionTimeout) {
      this.connectionTimeout = connectionTimeout;
      return this;
    }

    /**
     * Authentication token.
     *
     * @param token
     *            the token
     * @return the rest client builder
     */
    public RestClientBuilder authenticationToken(AuthenticationToken token) {
      if (token.getAuthMode() == AuthenticationMode.SHARED_SECRET_KEY) {
        headers.add(HttpHeaders.AUTHORIZATION, token.getSharedSecretKey());
      } else if (token.getAuthMode() == AuthenticationMode.BASIC_AUTH) {
        String base64 = Base64.getEncoder().encodeToString(
            (token.getUsername() + ":" + token.getPassword()).getBytes(StandardCharsets.UTF_8));
        headers.add(HttpHeaders.AUTHORIZATION, "Basic " + base64);
      }

      this.token = token;
      return this;
    }

    /**
     * Headers.
     *
     * @param headers
     *            the headers
     * @return the rest client builder
     */
    public RestClientBuilder headers(MultivaluedMap<String, Object> headers) {
      this.headers = headers;
      return this;
    }

    /**
     * Builds the.
     *
     * @return the rest client resource
     */
    public RestClient build() {
      return new RestClient(this);
    }

  }

  /**
   * Gets the uri.
   *
   * @return the uri
   */
  public String getUri() {
    return baseURI;
  }

  /**
   * Sets the uri.
   *
   * @param uri
   *            the new uri
   */
  public void setUri(String uri) {
    this.baseURI = uri;
  }

  /**
   * Gets the password.
   *
   * @return the password
   */
  public String getPassword() {
    return password;
  }

  /**
   * Sets the password.
   *
   * @param password
   *            the new password
   */
  public void setPassword(String password) {
    this.password = password;
  }

  /**
   * Gets the connection timeout.
   *
   * @return the connection timeout
   */
  public int getConnectionTimeout() {
    return connectionTimeout;
  }

  /**
   * Sets the connection timeout.
   *
   * @param connectionTimeout
   *            the new connection timeout
   */
  public void setConnectionTimeout(int connectionTimeout) {
    this.connectionTimeout = connectionTimeout;
  }

  /**
   * Gets the token.
   *
   * @return the token
   */
  public AuthenticationToken getToken() {
    return token;
  }

  /**
   * Sets the token.
   *
   * @param token
   *            the token
   */
  public void setToken(AuthenticationToken token) {
    this.token = token;
  }

  /**
   * Gets the headers.
   *
   * @return the headers
   */
  public MultivaluedMap<String, Object> getHeaders() {
    return headers;
  }

  /**
   * Sets the headers.
   *
   * @param headers
   *            the headers
   */
  public void setHeaders(MultivaluedMap<String, Object> headers) {
    this.headers = headers;
  }

  private static class JacksonConfigurator implements ContextResolver<ObjectMapper> {

    @Override
    public ObjectMapper getContext(Class<?> type) {
      ObjectMapper objectMapper = new ObjectMapper();
      
      return objectMapper;
    }
  }
}
