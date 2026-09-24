package fi.otavanopisto.muikku.auth;

import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import com.github.scribejava.core.builder.ScopeBuilder;
import com.github.scribejava.core.builder.ServiceBuilder;
import com.github.scribejava.core.builder.api.DefaultApi20;
import com.github.scribejava.core.oauth.OAuth20Service;

import fi.otavanopisto.muikku.model.security.AuthSource;

public abstract class OAuthAuthenticationStrategy extends AbstractAuthenticationStrategy {

  @Inject
  private Logger logger;
  
  @Inject
  private LoginSessionBean loginSessionBean;
  
  public OAuthAuthenticationStrategy() {
  }
  
  public OAuthAuthenticationStrategy(String... defaultScopes) {
    this.defaultScopes = defaultScopes;
  }

  protected String[] getDefaultScopes() {
    return defaultScopes;
  }

  @Override
  public abstract String getName();

  protected abstract DefaultApi20 getApi();

  protected abstract String getApiKey(AuthSource authSource);

  protected abstract String getApiSecret(AuthSource authSource);
  
  protected abstract String getOAuthCallbackURL(AuthSource authSource);

  protected abstract AuthenticationResult processResponse(HttpServletRequest request, AuthSource authSource, Map<String, String[]> requestParameters, OAuth20Service service, String[] requestedScopes);
  
  public boolean requiresCredentials() {
    return false;
  }
  
  @Override
  @Transactional(TxType.REQUIRES_NEW)
  public AuthenticationResult processLogin(HttpServletRequest request, AuthSource authSource) {
    Map<String, String[]> requestParameters = request.getParameterMap();
    if (!"rsp".equals(getFirstRequestParameter(requestParameters, "_stg"))) {
      String[] scopes;

      String[] extraScopes = requestParameters.get("extraScope");
      if ((extraScopes != null) && (extraScopes.length > 0)) {
        int defaultScopesLength = getDefaultScopes() != null ? getDefaultScopes().length : 0;
        int extraScopesLength = extraScopes.length;
        scopes = new String[defaultScopesLength + extraScopesLength];
        for (int i = 0; i < defaultScopesLength; i++) {
          scopes[i] = getDefaultScopes()[i];
        }

        for (int i = 0; i < extraScopesLength; i++) {
          scopes[i + defaultScopesLength] = extraScopes[i];
        }
      } else {
        scopes = requestParameters.get("scope");
      }

      if (scopes == null)
        scopes = defaultScopes;
      
      loginSessionBean.setRequestedScopes(scopes);
      
      return performDiscovery(authSource, requestParameters, scopes);
    } else {
      String[] requestedScopes = loginSessionBean.getRequestedScopes();
      String requestStateIdentifier = getFirstRequestParameter(requestParameters, "state");
      
      if (!loginSessionBean.isValidAuthorizationStateIdentifier(requestStateIdentifier)) {
        logger.log(Level.FINE, "State parameter doesn't match the one in login session.");
        return new AuthenticationResult(AuthenticationResult.Status.ERROR);
      }
      else {
        loginSessionBean.resetLoginState();
        OAuth20Service service = getOAuthService(authSource, requestParameters, requestedScopes);
        return processResponse(request, authSource, requestParameters, service, requestedScopes);
      }
    }
  }
  
  protected OAuth20Service getOAuthService(AuthSource authSource, Map<String, String[]> requestParameters, String... scopes) {
    String apiKey = getApiKey(authSource);
    String apiSecret = getApiSecret(authSource);
    String callback = getOAuthCallbackURL(authSource);
    DefaultApi20 api = getApi();

    ScopeBuilder scopeBuilder = scopes != null && scopes.length > 0 ? new ScopeBuilder(Set.of(scopes)) : null;

    return new ServiceBuilder(apiKey)
        .apiSecret(apiSecret)
        .defaultScope(scopeBuilder)
        .callback(callback)
        .build(api);
  }

  protected AuthenticationResult performDiscovery(AuthSource authSource, Map<String, String[]> requestParameters, String... scopes) {
    OAuth20Service service = getOAuthService(authSource, requestParameters, scopes);

    String authorizationStateIdentifier = loginSessionBean.newAuthorizationStateIdentifier();
    
    String authorizationUrl = service.createAuthorizationUrlBuilder()
      .state(authorizationStateIdentifier)
      .build();
    
    return new AuthenticationResult(AuthenticationResult.Status.PROCESSING, authorizationUrl);
  }

  private String[] defaultScopes;
}