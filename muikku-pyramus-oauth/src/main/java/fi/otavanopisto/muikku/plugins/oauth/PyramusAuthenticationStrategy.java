package fi.otavanopisto.muikku.plugins.oauth;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.scribe.builder.api.Api;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Token;
import org.scribe.model.Verb;
import org.scribe.model.Verifier;
import org.scribe.oauth.OAuthService;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

import fi.otavanopisto.muikku.auth.AuthenticationProvider;
import fi.otavanopisto.muikku.auth.AuthenticationResult;
import fi.otavanopisto.muikku.auth.AuthenticationResult.Status;
import fi.otavanopisto.muikku.auth.OAuthAuthenticationStrategy;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.plugins.oauth.scribe.PyramusApi20;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.pyramus.rest.model.WhoAmI;

public class PyramusAuthenticationStrategy extends OAuthAuthenticationStrategy implements AuthenticationProvider {

  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private SessionController sessionController;

  private String getAuthUrl() {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.authUrl");
  }

  private String getTokenUri() {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.tokenUri");
  }
  
  private String getWhoAmIUrl() {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.whoamiUrl");
  }
  
  @Override
  protected String getApiKey(AuthSource authSource) {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.clientId");
  }

  @Override
  protected String getApiSecret(AuthSource authSource) {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.clientSecret");
  }

  @Override
  protected String getOAuthCallbackURL(AuthSource authSource) {
    return pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.redirectUrl");
  }

  @Override
  public String getName() {
    return "pyramusoauth";
  }

  @Override
  public String getDescription() {
    return "Pyramus";
  }
  
  @Override
  protected Api getApi() {
    return new PyramusApi20(getAuthUrl(), getTokenUri());
  }

  @Override
  protected AuthenticationResult processResponse(HttpServletRequest servletRequest, AuthSource authSource, Map<String, String[]> requestParameters, OAuthService service, String[] requestedScopes) {
    ObjectMapper objectMapper = new ObjectMapper();

    String verifier = getFirstRequestParameter(requestParameters, "code");

    Verifier v = new Verifier(verifier);
    Token accessToken = service.getAccessToken(null, v);
    
    PyramusAccessToken pyramusAccessToken;
    try {
      pyramusAccessToken = objectMapper.readValue(accessToken.getRawResponse(), PyramusAccessToken.class);
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, pyramusAccessToken.getExpiresIn());
      Date expires = calendar.getTime();
      sessionController.addOAuthAccessToken("pyramus", expires, accessToken.getToken(), pyramusAccessToken.getRefreshToken());
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Token extraction failed a JSON parsing error", e);
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
    
    WhoAmI whoAmI = null;

    OAuthRequest request = new OAuthRequest(Verb.GET, getWhoAmIUrl());
    service.signRequest(accessToken, request);
    Response response = request.send();
    try {
      whoAmI = objectMapper.readValue(response.getBody(), WhoAmI.class);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Logging in failed because of a JSON parsing exception", e);
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
    
    return processLogin(servletRequest, authSource, requestParameters, whoAmI.getId().toString(), whoAmI.getEmails(), whoAmI.getFirstName(), whoAmI.getLastName());
  }

  @Override
  public AuthenticationResult processLogout(AuthSource authSource) {
    String redirectUrl = pluginSettingsController.getPluginSetting(PyramusOAuthPluginDescriptor.PLUGIN_NAME, "oauth.logoutUrl");
    if (StringUtils.isNotBlank(redirectUrl)) {
      return new AuthenticationResult(Status.LOGOUT_WITH_REDIRECT, redirectUrl);
    } else {
      logger.log(Level.SEVERE, "Cannot fulfill Pyramus OAuth logout as the logout url is not specified");
      return new AuthenticationResult(Status.LOGOUT);
    }
  }
  
  @SuppressWarnings("unused")
  @JsonIgnoreProperties(ignoreUnknown = true)
  private static class PyramusAccessToken {

    public Integer getExpiresIn() {
      return expiresIn;
    }

    public void setExpiresIn(Integer expiresIn) {
      this.expiresIn = expiresIn;
    }

    public String getRefreshToken() {
      return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
      this.refreshToken = refreshToken;
    }

    @JsonProperty("expires_in")
    private Integer expiresIn;
    
    @JsonProperty("refresh_token")
    private String refreshToken;
  }

}