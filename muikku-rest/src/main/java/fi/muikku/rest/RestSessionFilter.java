package fi.muikku.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.enterprise.inject.Default;
import javax.inject.Inject;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import fi.muikku.rest.oauth.OAuthAuthentication;
import fi.muikku.rest.oauth.OAuthRestAuthentication;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.session.RestSessionController;
import fi.muikku.session.RestSesssion;
import fi.muikku.session.SessionControllerDelegate;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionAuthentication;
import fi.muikku.session.local.LocalSessionController;
import fi.muikku.session.local.LocalSessionRestAuthentication;

@WebFilter(urlPatterns = "/rest/*")
public class RestSessionFilter implements Filter {

  @Inject
  @RestSesssion
  private RestSessionController restSessionController;

  @Inject
  @LocalSession
  private LocalSessionController localSessionController;
  
  @Inject
  @Default
  private SessionControllerDelegate sessionControllerDelegate;
  
  @Inject
  @OAuthAuthentication
  private OAuthRestAuthentication oAuthRestAuthentication;
  
  @Inject
  @LocalSessionAuthentication
  private LocalSessionRestAuthentication localSessionRestAuthentication;
  
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
    if (request instanceof HttpServletRequest) {
      HttpServletRequest servletRequest = (HttpServletRequest) request;
      String authorizationHeader = servletRequest.getHeader("authorization");
      if (StringUtils.isNotBlank(authorizationHeader) && authorizationHeader.startsWith("OAuth")) {
        // Request is authenticated by oAuth
        OAuthAuthorization oAuthAuthorization = new OAuthAuthorization();
        oAuthAuthorization.parse(authorizationHeader);
        oAuthRestAuthentication.login(oAuthAuthorization.getConsumerKey(), oAuthAuthorization.getToken());
        restSessionController.setAuthentication(oAuthRestAuthentication);
      } else {
        HttpSession session = ((HttpServletRequest) request).getSession(false);
        if (session != null) {
          // Request is authenticated by local session.
          UserEntity user = localSessionController.getUser();
          localSessionRestAuthentication.setUser(user);
          restSessionController.setAuthentication(localSessionRestAuthentication);
        } 
      }
    }

    sessionControllerDelegate.setImplementation(restSessionController);

    try {
      chain.doFilter(request, response);
    } finally {
      restSessionController.logout();
    }
    
  }

  @Override
  public void destroy() {
  }

  private class OAuthAuthorization {

    public void parse(String authorizationHeader) {
      if (authorizationHeader.startsWith("OAuth")) {
        String[] values = authorizationHeader.substring(5).split(",");
        Map<String, String> valueMap = new HashMap<String, String>(values.length);
        for (int i = 0, l = values.length; i < l; i++) {
          String[] splitValue = values[i].split("=", 2);
          
          String name = splitValue[0].trim();
          String value = splitValue[1].trim();
          if (value.startsWith("\"") && value.endsWith("\""))
            valueMap.put(name, value.substring(1, value.length() - 1));
          else
            valueMap.put(name, value);
        }

        signature = valueMap.get("oauth_signature");
        nonce = valueMap.get("oauth_nonce");
        signatureMethod = valueMap.get("oauth_signature_method");
        consumerKey = valueMap.get("oauth_consumer_key");
        version = valueMap.get("oauth_version");
        timestamp = NumberUtils.createLong(valueMap.get("oauth_timestamp"));
        token = valueMap.get("oauth_token");
      }
    }

    @SuppressWarnings("unused")
    public String getSignature() {
      return signature;
    }

    @SuppressWarnings("unused")
    public String getNonce() {
      return nonce;
    }

    @SuppressWarnings("unused")
    public String getSignatureMethod() {
      return signatureMethod;
    }

    public String getConsumerKey() {
      return consumerKey;
    }

    @SuppressWarnings("unused")
    public String getVersion() {
      return version;
    }

    @SuppressWarnings("unused")
    public Long getTimestamp() {
      return timestamp;
    }

    public String getToken() {
      return token;
    }

    private String signature;
    private String nonce;
    private String signatureMethod;
    private String consumerKey;
    private String version;
    private Long timestamp;
    private String token;

  }

}
