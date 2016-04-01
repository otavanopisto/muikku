package fi.otavanopisto.muikku.plugins.oauth;

import java.io.IOException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.inject.Inject;

import org.apache.commons.lang3.math.NumberUtils;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.ObjectMapper;
import org.scribe.builder.api.Api;
import org.scribe.builder.api.FacebookApi;
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
import fi.otavanopisto.muikku.session.SessionController;

public class FacebookAuthenticationStrategy extends OAuthAuthenticationStrategy implements AuthenticationProvider {
  
  @Inject
  private Logger logger;

  @Inject
  private SessionController sessionController;
  
  public FacebookAuthenticationStrategy() {
    super("email");
  }

  @Override
  protected String getApiKey(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.facebook.apiKey");
  }

  @Override
  protected String getApiSecret(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.facebook.apiSecret");
  }

  @Override
  protected String getOAuthCallbackURL(AuthSource authSource) {
    return getAuthSourceSetting(authSource, "oauth.facebook.callbackUrl");
  }

  @Override
  public String getName() {
    return "facebookoauth";
  }
  
  @Override
  public String getDescription() {
    return "Facebook";
  } 
  
  @Override
  protected Api getApi() {
    return new FacebookApi();  
  }
  
  @Override
  protected AuthenticationResult processResponse(AuthSource authSource, Map<String, String[]> requestParameters, OAuthService service, String[] requestedScopes) {
    ObjectMapper objectMapper = new ObjectMapper();
    String verifier = getFirstRequestParameter(requestParameters, "code");
    
    Verifier v = new Verifier(verifier);
    Token accessToken = service.getAccessToken(null, v);     
    
    FacebookUser meObject = null;
    OAuthRequest request = new OAuthRequest(Verb.GET, "https://graph.facebook.com/me");
    service.signRequest(accessToken, request);
    Response response = request.send();
    try {
      meObject = objectMapper.readValue(response.getBody(), FacebookUser.class);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Logging in failed because of a JSON parsing exception", e);
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
    
    Integer expiresIn = extractExpires(accessToken);

    Date expires = null;
    if (expiresIn != null) {
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, expiresIn);
      expires = calendar.getTime();
      sessionController.addOAuthAccessToken("facebook", expires, accessToken.getToken(), null);
    }    
    
    if (meObject != null)
      return processLogin(authSource, requestParameters, meObject.getId(), Arrays.asList(meObject.getEmail()), meObject.getFirstName(), meObject.getLastName());
    else {
      return new AuthenticationResult(AuthenticationResult.Status.GRANT);
    }
  }

  private Integer extractExpires(Token accessToken) {
    try {
      Pattern pattern = Pattern.compile("expires=[0-9]*");
      Matcher matcher = pattern.matcher(accessToken.getRawResponse());
      if (matcher.find()) {
        String[] split = matcher.group().split("=");
        if (split.length == 2)
          return NumberUtils.createInteger(split[1]);
      }
      
      return null;
    } catch (Exception e) {
      return null;
    }
  }
  
  @JsonIgnoreProperties(ignoreUnknown = true)
  @SuppressWarnings ("unused")
  private static class FacebookUser {
    
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getFirstName() {
      return firstName;
    }

    public void setFirstName(String firstName) {
      this.firstName = firstName;
    }

    public String getLastName() {
      return lastName;
    }

    public void setLastName(String lastName) {
      this.lastName = lastName;
    }

    public String getLink() {
      return link;
    }

    public void setLink(String link) {
      this.link = link;
    }

    public String getUsername() {
      return username;
    }

    public void setUsername(String username) {
      this.username = username;
    }

    public String getGender() {
      return gender;
    }

    public void setGender(String gender) {
      this.gender = gender;
    }

    public Locale getLocale() {
      return locale;
    }

    public void setLocale(Locale locale) {
      this.locale = locale;
    }
    
    public String getEmail() {
      return email;
    }
    
    public void setEmail(String email) {
      this.email = email;
    }

    private String id;
    
    private String name;
    
    @JsonProperty ("first_name")
    private String firstName;
    
    @JsonProperty ("last_name")
    private String lastName;
    
    private String link;
    
    private String username;
    
    private String gender;
    
    private Locale locale;
    
    private String email;
  }
  
}