package fi.otavanopisto.muikku.plugins.oauth.scribe;

import java.io.IOException;

import org.codehaus.jackson.map.ObjectMapper;
import org.scribe.builder.api.DefaultApi20;
import org.scribe.exceptions.OAuthException;
import org.scribe.model.OAuthConfig;
import org.scribe.model.OAuthConstants;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuth20ServiceImpl;

public class PyramusApi20ServiceImpl extends OAuth20ServiceImpl {

  public PyramusApi20ServiceImpl(DefaultApi20 api, OAuthConfig config) {
    super(api, config);

    this.api = api;
    this.config = config;
  }

  @Override
  public Token getAccessToken(Token requestToken, Verifier verifier) {
    OAuthRequest request = new OAuthRequest(api.getAccessTokenVerb(), api.getAccessTokenEndpoint());
    request.addBodyParameter(OAuthConstants.CLIENT_ID, config.getApiKey());
    request.addBodyParameter(OAuthConstants.CLIENT_SECRET, config.getApiSecret());
    request.addBodyParameter(OAuthConstants.CODE, verifier.getValue());
    request.addBodyParameter(OAuthConstants.REDIRECT_URI, config.getCallback());
    request.addBodyParameter("grant_type", "authorization_code");
    if (config.hasScope())
      request.addBodyParameter(OAuthConstants.SCOPE, config.getScope());
    Response response = request.send();
    
    ObjectMapper objectMapper = new ObjectMapper();
    String tokenJson;
    try {
      tokenJson = objectMapper.writeValueAsString(objectMapper.readTree(response.getBody()));
    } catch (IOException e) {
      throw new OAuthException("Invalid Token JSON", e);
    }
    
    return api.getAccessTokenExtractor().extract(tokenJson);
  }
  
  @Override
  public void signRequest(Token accessToken, OAuthRequest request) {
    request.addHeader(OAuthConstants.HEADER, "Bearer " + accessToken.getToken());
  }


  private final OAuthConfig config;
  private final DefaultApi20 api;
}
