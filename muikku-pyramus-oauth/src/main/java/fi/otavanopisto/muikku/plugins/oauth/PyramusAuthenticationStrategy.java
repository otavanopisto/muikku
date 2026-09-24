package fi.otavanopisto.muikku.plugins.oauth;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.scribejava.core.builder.api.DefaultApi20;
import com.github.scribejava.core.model.OAuth2AccessToken;
import com.github.scribejava.core.model.OAuthRequest;
import com.github.scribejava.core.model.Response;
import com.github.scribejava.core.model.Verb;
import com.github.scribejava.core.oauth.OAuth20Service;

import fi.otavanopisto.muikku.auth.AuthenticationProvider;
import fi.otavanopisto.muikku.auth.AuthenticationResult;
import fi.otavanopisto.muikku.auth.AuthenticationResult.Status;
import fi.otavanopisto.muikku.auth.OAuthAuthenticationStrategy;
import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.plugins.oauth.scribe.PyramusApi20;
import fi.otavanopisto.muikku.plugins.schooldatapyramus.SchoolDataPyramusPluginDescriptor;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.pyramus.rest.model.WhoAmI;

public class PyramusAuthenticationStrategy extends OAuthAuthenticationStrategy implements AuthenticationProvider {

  protected final static String WHOAMI_PATH = "/1/system/whoami";
  
  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @Inject
  private SessionController sessionController;

  public PyramusAuthenticationStrategy() {
    // Initialize with a default scope
    super("legacy");
  }
  
  private String getPyramusHost() {
    return pluginSettingsController.getPluginSetting(SchoolDataPyramusPluginDescriptor.PLUGIN_NAME, "pyramusOrigin");
  }
  
  private String getWhoAmIUrl() {
    String origin = getPyramusHost();
    return origin != null ? origin + WHOAMI_PATH : null;
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
  protected DefaultApi20 getApi() {
    return new PyramusApi20(getPyramusHost());
  }

  @Override
  protected AuthenticationResult processResponse(HttpServletRequest servletRequest, AuthSource authSource, Map<String, String[]> requestParameters, OAuth20Service service, String[] requestedScopes) {
    ObjectMapper objectMapper = new ObjectMapper();

    String authorizationCode = getFirstRequestParameter(requestParameters, "code");
    if (StringUtils.isBlank(authorizationCode)) {
      logger.log(Level.FINE, "Logging in failed because authorization code was blank.");
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
    
    try {
      OAuth2AccessToken accessToken = service.getAccessToken(authorizationCode);
      
      int expiresIn = accessToken.getExpiresIn() != null ? accessToken.getExpiresIn() : 3600;
      Calendar calendar = new GregorianCalendar();
      calendar.setTime(new Date());
      calendar.add(Calendar.SECOND, expiresIn);
      Date expires = calendar.getTime();
      sessionController.addOAuthAccessToken("pyramus", expires, accessToken.getAccessToken(), accessToken.getRefreshToken());
    
      WhoAmI whoAmI = null;
  
      OAuthRequest request = new OAuthRequest(Verb.GET, getWhoAmIUrl());
      service.signRequest(accessToken, request);
      Response response = service.execute(request);
      whoAmI = objectMapper.readValue(response.getBody(), WhoAmI.class);
      return processLogin(servletRequest, authSource, requestParameters, whoAmI.getId().toString(), whoAmI.getEmails(), whoAmI.getFirstName(), whoAmI.getLastName());
    } catch (Exception e) {
      logger.log(Level.SEVERE, "Logging in failed because fetching token or whoami failed.", e);
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }
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
  
}