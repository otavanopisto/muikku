package fi.muikku.auth;

import java.util.Map;

import javax.inject.Inject;

import org.scribe.builder.ServiceBuilder;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.DefaultApi10a;
import org.scribe.model.Token;
import org.scribe.oauth.OAuthService;

import fi.muikku.model.security.AuthSource;

public abstract class OAuthAuthenticationStrategy extends AbstractAuthenticationStrategy {
  
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

  protected abstract Api getApi();

  protected abstract String getApiKey(AuthSource authSource);

  protected abstract String getApiSecret(AuthSource authSource);
  
  protected abstract String getOAuthCallbackURL(AuthSource authSource);

  protected abstract AuthenticationResult processResponse(AuthSource authSource, Map<String, String[]> requestParameters, OAuthService service, String[] requestedScopes);
  
  public boolean requiresCredentials() {
    return false;
  }
  
  @Override
  public AuthenticationResult processLogin(AuthSource authSource, Map<String, String[]> requestParameters) {
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
      loginSessionBean.setRequestedScopes(null);
      OAuthService service = getOAuthService(authSource, requestParameters, requestedScopes);
      return processResponse(authSource, requestParameters, service, requestedScopes);
    }
  }
  
  protected OAuthService getOAuthService(AuthSource authSource, Map<String, String[]> requestParameters, String... scopes) {
    String apiKey = getApiKey(authSource);
    String apiSecret = getApiSecret(authSource);
    String callback = getOAuthCallbackURL(authSource);
    Api api = getApi();

    ServiceBuilder serviceBuilder = new ServiceBuilder().provider(api).apiKey(apiKey).apiSecret(apiSecret).callback(callback);

    if (scopes != null && scopes.length > 0) {
      StringBuilder scopeBuilder = new StringBuilder();
      for (int i = 0, l = scopes.length; i < l; i++) {
        scopeBuilder.append(scopes[i]);
        if (i < (l - 1))
          scopeBuilder.append(' ');
      }
      serviceBuilder = serviceBuilder.scope(scopeBuilder.toString());
    }

    return serviceBuilder.build();
  }

  protected AuthenticationResult performDiscovery(AuthSource authSource, Map<String, String[]> requestParameters, String... scopes) {
    OAuthService service = getOAuthService(authSource, requestParameters, scopes);

    Token requestToken = null;
    boolean isV1 = getApi() instanceof DefaultApi10a;

    // For OAuth version 1 the request token is fetched, for v2 it's not
    if (isV1)
      requestToken = service.getRequestToken();

    String url = service.getAuthorizationUrl(requestToken);
    loginSessionBean.setRequestToken(requestToken);
    
    return new AuthenticationResult(AuthenticationResult.Status.PROCESSING, url);
  }

  private String[] defaultScopes;
}