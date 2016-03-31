package fi.otavanopisto.muikku.plugins.oauth;

import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.ObjectMapper;
import org.scribe.builder.api.Api;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import fi.otavanopisto.muikku.auth.AuthenticationProvider;
import fi.otavanopisto.muikku.auth.AuthenticationResult;
import fi.otavanopisto.muikku.auth.OAuthAuthenticationStrategy;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.plugins.oauth.scribe.GoogleApi20;
import fi.otavanopisto.muikku.session.SessionController;

public class GoogleAuthenticationStrategy extends OAuthAuthenticationStrategy implements AuthenticationProvider {
  
  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;
  
  public GoogleAuthenticationStrategy() {
    super("https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile");
  }

  @Override
  protected String getApiKey(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.google.apiKey");
  }

  @Override
  protected String getApiSecret(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.google.apiSecret");
  }

  @Override
  protected String getOAuthCallbackURL(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.google.callbackUrl");
  }

  @Override
  public String getName() {
    return "googleoauth";
  }
  
  @Override
  public String getDescription() {
    return "Google";
  }
  
  @Override
  protected Api getApi() {
    return new GoogleApi20();
  }
  
  @Override
  protected AuthenticationResult processResponse(AuthSource authSource, Map<String, String[]> requestParameters, OAuthService service, String[] requestedScopes) {
    ObjectMapper objectMapper = new ObjectMapper();

    String verifier = getFirstRequestParameter(requestParameters, "code");

    Verifier v = new Verifier(verifier);
    Token accessToken = service.getAccessToken(null, v);

    GoogleAccessToken googleAccessToken;
    try {
      googleAccessToken = objectMapper.readValue(accessToken.getRawResponse(), GoogleAccessToken.class);
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, googleAccessToken.getExpiresIn());
      Date expires = calendar.getTime();
      sessionController.addOAuthAccessToken("google", expires, accessToken.getToken(), null);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Token extraction failed a JSON parsing error", e);
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
    
    List<String> scopesList = Arrays.asList(requestedScopes);

    boolean hasProfileScope = scopesList.contains("https://www.googleapis.com/auth/userinfo.profile");
    
    GoogleUserInfo userInfo = null;
    
    if (hasProfileScope) {
      OAuthRequest request = new OAuthRequest(Verb.GET, "https://www.googleapis.com/oauth2/v1/userinfo?alt=json");
      service.signRequest(accessToken, request);
      Response response = request.send();
      try {
        userInfo = objectMapper.readValue(response.getBody(), GoogleUserInfo.class);
      } catch (IOException e) {
        logger.log(Level.SEVERE, "Logging in failed because of a JSON parsing exception", e);
        return new AuthenticationResult(AuthenticationResult.Status.ERROR);
      }
    }

    if (userInfo != null)
      return processLogin(authSource, requestParameters, userInfo.getId(), Arrays.asList(userInfo.getEmail()), userInfo.getGivenName(), userInfo.getFamilyName());
    else {
      return new AuthenticationResult(AuthenticationResult.Status.GRANT);
    }
  }
  
  @SuppressWarnings ("unused")
  @JsonIgnoreProperties (ignoreUnknown = true)
  private static class GoogleAccessToken {
    
    public Integer getExpiresIn() {
      return expiresIn;
    }
    
    public void setExpiresIn(Integer expiresIn) {
      this.expiresIn = expiresIn;
    }
    
    @JsonProperty ("expires_in")
    private Integer expiresIn;
  }

  @SuppressWarnings ("unused")
  @JsonIgnoreProperties (ignoreUnknown = true)
  private static class GoogleUserInfo {
    
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getGivenName() {
      return givenName;
    }

    public void setGivenName(String givenName) {
      this.givenName = givenName;
    }

    public String getFamilyName() {
      return familyName;
    }

    public void setFamilyName(String familyName) {
      this.familyName = familyName;
    }

    public Locale getLocale() {
      return locale;
    }

    public void setLocale(Locale locale) {
      this.locale = locale;
    }

    private String id;
    
    private String email;
    
    @JsonProperty ("given_name")
    private String givenName;
    
    @JsonProperty ("family_name")
    private String familyName;
    
    private Locale locale;
  }

}