package fi.muikku.rest;

import java.net.HttpURLConnection;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import org.apache.commons.lang3.StringUtils;
import org.jboss.resteasy.auth.oauth.OAuthConsumer;
import org.jboss.resteasy.auth.oauth.OAuthException;
import org.jboss.resteasy.auth.oauth.OAuthRequestToken;
import org.jboss.resteasy.auth.oauth.OAuthToken;

import fi.muikku.dao.oauth.AccessTokenDAO;
import fi.muikku.dao.oauth.ConsumerDAO;
import fi.muikku.dao.oauth.ConsumerPermissionDAO;
import fi.muikku.dao.oauth.ConsumerScopeDAO;
import fi.muikku.dao.oauth.RequestTokenDAO;
import fi.muikku.dao.oauth.TokenPermissionDAO;
import fi.muikku.dao.oauth.TokenScopeDAO;
import fi.muikku.model.oauth.AccessToken;
import fi.muikku.model.oauth.Consumer;
import fi.muikku.model.oauth.ConsumerPermission;
import fi.muikku.model.oauth.ConsumerScope;
import fi.muikku.model.oauth.RequestToken;
import fi.muikku.session.SessionController;

@RequestScoped
@Stateful
public class OAuthProvider implements org.jboss.resteasy.auth.oauth.OAuthProvider {
  
  private final static long TOKEN_EXPIRE_TIME = 1000 * 60 * 60;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private ConsumerDAO consumerDAO;

  @Inject
  private ConsumerScopeDAO consumerScopeDAO;

  @Inject
  private ConsumerPermissionDAO consumerPermissionDAO;

  @Inject
  private RequestTokenDAO requestTokenDAO;
  
  @Inject
  private AccessTokenDAO accessTokenDAO;

  @Inject
  private TokenPermissionDAO tokenPermissionDAO;

  @Inject
  private TokenScopeDAO tokenScopeDAO;

  @Override
  public OAuthConsumer registerConsumer(String consumerKey, String displayName, String connectURI) throws OAuthException {
    Consumer consumer = consumerDAO.create(consumerKey, displayName, connectURI);
    // TODO: Secret?
    // TODO: Should be pooled?
    return new OAuthConsumer(consumer.getConsumerKey(), null, consumer.getDisplayName(), consumer.getConnectURI());
  }

  @Override
  public void registerConsumerScopes(String consumerKey, String[] scopes) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    List<String> scopesList = Arrays.asList(scopes);

    List<ConsumerScope> removedScopes = consumerScopeDAO.listByConsumerAndScopeNotIn(consumer, scopesList);
    
    for (ConsumerScope removedScope : removedScopes) {
      consumerScopeDAO.delete(removedScope);
    }
    
    for (String scope : scopesList) {
      ConsumerScope consumerScope = consumerScopeDAO.findByConsumerAndScope(consumer, scope);
      if (consumerScope == null)
        consumerScopeDAO.create(consumer, scope);
    }
  }

  @Override
  public void registerConsumerPermissions(String consumerKey, String[] permissions) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    List<String> permissionsList = Arrays.asList(permissions);

    List<ConsumerPermission> removedPermissions = consumerPermissionDAO.listByConsumerAndPermissionNotIn(consumer, permissionsList);
    
    for (ConsumerPermission removedPermission : removedPermissions) {
      consumerPermissionDAO.delete(removedPermission);
    }
    
    for (String permission : permissionsList) {
      ConsumerPermission consumerPermission = consumerPermissionDAO.findByConsumerAndPermission(consumer, permission);
      if (consumerPermission == null)
        consumerPermissionDAO.create(consumer, permission);
    }
  }

  @Override
  public String getRealm() {
    return "muikku-api";
  }

  @Override
  public OAuthConsumer getConsumer(String consumerKey) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }
    
    // TODO: Secret?
    // TODO: Should be pooled?
    return getConsumer(consumer);
  }

  private OAuthConsumer getConsumer(Consumer consumer) {
    return new OAuthConsumer(consumer.getConsumerKey(), consumer.getConsumerSecret(), consumer.getDisplayName(), consumer.getConnectURI());
  }

  @Override
  public OAuthRequestToken getRequestToken(String consumerKey, String requestToken) throws OAuthException {
    RequestToken token = requestTokenDAO.findByToken(requestToken);
    if (token == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Token Not Found");
    }
    
    if (token.getConsumer() == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }

    return new OAuthRequestToken(token.getToken(), token.getSecret(), token.getCallback(), null, null, token.getTimeToLive(), getConsumer(token.getConsumer()));
  }

  @Override
  public OAuthToken getAccessToken(String consumerKey, String accessToken) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }
    
    AccessToken token = accessTokenDAO.findByConsumerAndToken(consumer, accessToken);
    if (token == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Token Not Found");
    }
    
    return new OAuthToken(token.getToken(), token.getSecret(), null, null, token.getTimeToLive(), getConsumer(consumer));
  }

  @Override
  public OAuthToken makeRequestToken(String consumerKey, String callback, String[] scopes, String[] permissions) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }
    
    String token = UUID.randomUUID().toString();
    String secret = UUID.randomUUID().toString();
    Long timestamp = System.currentTimeMillis();
    Long timeToLive = timestamp + TOKEN_EXPIRE_TIME;
    
    RequestToken requestToken = requestTokenDAO.create(consumer, token, secret, timestamp, timeToLive, callback, null, null);
    if (scopes != null) {
      for (String scope : scopes) {
        tokenScopeDAO.create(requestToken, scope);
      }
    }

    return new OAuthToken(requestToken.getToken(), requestToken.getSecret(), scopes, permissions, requestToken.getTimeToLive(), getConsumer(consumer));
  }

  @Override
  public OAuthToken makeAccessToken(String consumerKey, String reqToken, String verifier) throws OAuthException {
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }
    
    RequestToken requestToken = requestTokenDAO.findByConsumerAndToken(consumer, reqToken);
    if (requestToken == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Token Not Found");
    }
    
    if (StringUtils.isBlank(requestToken.getVerifier())) {
      throw new OAuthException(HttpURLConnection.HTTP_FORBIDDEN, "Token Not Verfied");
    }
    
    if (!requestToken.getVerifier().equals(verifier)) {
      throw new OAuthException(HttpURLConnection.HTTP_FORBIDDEN, "Invalid Token Verification");
    }

    String token = UUID.randomUUID().toString();
    String secret = UUID.randomUUID().toString();
    Long timestamp = System.currentTimeMillis();
    Long timeToLive = timestamp + TOKEN_EXPIRE_TIME;
//    User user = sessionController.getLoggedUser();

    accessTokenDAO.create(consumer, requestToken.getUser(), token, requestToken.getSecret(), timestamp, timeToLive);
    requestTokenDAO.delete(requestToken);
    
    return new OAuthToken(token, secret, null, null, requestToken.getTimeToLive(), getConsumer(consumer));
  }

  @Override
  public String authoriseRequestToken(String consumerKey, String reqToken) throws OAuthException {
    
    Consumer consumer = consumerDAO.findByConsumerKey(consumerKey);
    if (consumer == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Consumer Not Found");
    }
    
    RequestToken requestToken = requestTokenDAO.findByConsumerAndToken(consumer, reqToken);
    if (requestToken == null) {
      // TODO: Localize
      throw new OAuthException(HttpURLConnection.HTTP_NOT_FOUND, "Token Not Found");
    }
    
    if (StringUtils.isNotBlank(requestToken.getVerifier())) {
      throw new OAuthException(HttpURLConnection.HTTP_FORBIDDEN, "Token Already Verfied");
    }
    
    String verifier = UUID.randomUUID().toString();

    requestTokenDAO.updateVerifier(requestToken, verifier);
    
    return verifier;
  }

  @Override
  public void checkTimestamp(OAuthToken token, long timestamp) throws OAuthException {
    // TODO Auto-generated method stub
    
  }

  @Override
  public Set<String> convertPermissionsToRoles(String[] permissions) {
    // TODO Auto-generated method stub
    return null;
  }


}
