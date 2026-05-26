package fi.otavanopisto.muikku.plugins.oauth.scribe;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;

public class PyramusApi20 extends DefaultApi20 {

  private final static String AUTHORIZATION_PATH = "/users/authorize.page?client_id=%s&response_type=code&redirect_uri=%s&scope=%s";
  private final static String TOKEN_PATH = "/1/oauth/token";
  
  public PyramusApi20(String pyramusOrigin) {
    this.pyramusOrigin = pyramusOrigin;
  }
  
  @Override
  public String getAccessTokenEndpoint() {
    return pyramusOrigin + TOKEN_PATH;
  }

  @Override
  public String getAuthorizationUrl(OAuthConfig config) {
    return String.format(pyramusOrigin + AUTHORIZATION_PATH, config.getApiKey(), OAuthEncoder.encode(config.getCallback()), config.getScope());
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
  
  private String pyramusOrigin;
}
