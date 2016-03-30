package fi.otavanopisto.muikku.plugins.oauth.scribe;

import org.scribe.builder.api.DefaultApi20;
import org.scribe.extractors.AccessTokenExtractor;
import org.scribe.extractors.JsonTokenExtractor;
import org.scribe.model.OAuthConfig;
import org.scribe.model.Verb;
import org.scribe.oauth.OAuthService;
import org.scribe.utils.OAuthEncoder;

public class PyramusApi20 extends DefaultApi20 {

  public PyramusApi20(String authorizationUrl, String tokenUri) {
    this.authorizationUrl = authorizationUrl;
    this.tokenUri = tokenUri;
  }
  
  @Override
  public String getAccessTokenEndpoint() {
    return tokenUri;
  }

  @Override
  public String getAuthorizationUrl(OAuthConfig config) {
    return String.format(authorizationUrl, config.getApiKey(), OAuthEncoder.encode(config.getCallback()));
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
  
  private String authorizationUrl;
  private String tokenUri;
}
