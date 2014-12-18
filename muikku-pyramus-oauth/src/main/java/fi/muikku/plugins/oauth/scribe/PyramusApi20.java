package fi.muikku.plugins.oauth.scribe;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;

public class PyramusApi20 extends DefaultApi20 {

  public static final String AUTHORIZATION_URL = "https://dev.pyramus.fi:8443/users/authorize.page?client_id=%s&response_type=code&redirect_uri=%s";
  public static final String TOKEN_URI = "https://dev.pyramus.fi:8443/1/oauth/token";

  @Override
  public String getAccessTokenEndpoint() {
    return TOKEN_URI;
  }

  @Override
  public String getAuthorizationUrl(OAuthConfig config) {
    return String.format(AUTHORIZATION_URL, config.getApiKey(), OAuthEncoder.encode(config.getCallback()));
  }

  @Override
  public AccessTokenExtractor getAccessTokenExtractor() {
    return new JsonTokenExtractor();
  }

  @Override
  public Verb getAccessTokenVerb() {
    return Verb.POST;
  }

  @Override
  public OAuthService createService(OAuthConfig config) {
    return new PyramusApi20ServiceImpl(this, config);
  }
}
