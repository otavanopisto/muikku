package fi.otavanopisto.muikku.auth;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

@SessionScoped
@Stateful
public class LoginSessionBean {

  public String newAuthorizationStateIdentifier() {
    this.authorizationStateIdentifier = RandomStringUtils.randomAlphanumeric(8);
    return this.authorizationStateIdentifier;
  }

  public String getAuthorizationStateIdentifier() {
    return this.authorizationStateIdentifier;
  }
  
  public boolean isValidAuthorizationStateIdentifier(String requestStateIdentifier) {
    return authorizationStateIdentifier != null && StringUtils.equals(this.authorizationStateIdentifier, requestStateIdentifier);
  }
  
  public String[] getRequestedScopes() {
    return requestedScopes;
  }

  public void setRequestedScopes(String[] requestedScopes) {
    this.requestedScopes = requestedScopes;
  }
  
  public Long getAuthSourceId() {
    return authSourceId;
  }
  
  public void setAuthSourceId(Long authSourceId) {
    this.authSourceId = authSourceId;
  } 
  
  public String getPostLoginRedirectUrl() {
    return postLoginRedirectUrl;
  }
  
  public void setPostLoginRedirectUrl(String postLoginRedirectUrl) {
    this.postLoginRedirectUrl = postLoginRedirectUrl;
  }
  
  public void resetLoginState() {
    requestedScopes = null;
    authorizationStateIdentifier = null;
  }
  
  private String[] requestedScopes;
  private Long authSourceId;
  private String postLoginRedirectUrl;
  private String authorizationStateIdentifier;
}
