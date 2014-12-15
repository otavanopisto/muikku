package fi.muikku.auth;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;
import org.ocpsoft.rewrite.faces.annotation.Deferred;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.security.AuthSource;

@RequestScoped
@Named
@Join (path = "/login", to = "/login.jsf")
public class LoginBackingBean {

  @Parameter
  private Long authSourceId;

  @Parameter
  private String redirectUrl;
  
  @Inject
  private AuthSourceController authSourceController;
  
  @Inject
  private LoginSessionBean loginSessionBean;
  
  @RequestAction
  @Deferred
  public String init() {
    try {
      FacesContext facesContext = FacesContext.getCurrentInstance();
      ExternalContext externalContext = facesContext.getExternalContext();
      Map<String, String[]> requestParameters = externalContext.getRequestParameterValuesMap();

      if (authSourceId == null) {
        authSourceId = loginSessionBean.getAuthSourceId();
      } else {
        loginSessionBean.setAuthSourceId(authSourceId);
      }

      if (StringUtils.isNotBlank(redirectUrl)) {
        loginSessionBean.setPostLoginRedirectUrl(redirectUrl);
      }
      
      if (authSourceId == null) {
        // authentication source id is not defined, which means that we need to ask the user which he or she is 
        // going to use, unless only one source is defined and it's credentialess one, in which case we use that one.
  
        List<AuthSource> credentialAuthSources = authSourceController.listCredentialAuthSources();
        List<AuthSource> credentialessAuthSources = authSourceController.listCredentialAuthSources();
        
        if (credentialAuthSources.isEmpty() && credentialessAuthSources.size() == 1) {
          authSourceId = credentialessAuthSources.get(0).getId();
        }
      }
      
      if (authSourceId != null) {
        AuthSource authSource = authSourceController.findAuthSourceById(authSourceId);
        if (authSource != null) {
          AuthenticationProvider authenticationProvider = authSourceController.findAuthenticationProvider(authSource);
          if (authenticationProvider != null) {
            
            AuthenticationResult result = authenticationProvider.processLogin(authSource, requestParameters);
            if (StringUtils.isNotBlank(result.getRedirectUrl())) {
              externalContext.redirect(result.getRedirectUrl());
            } else {
              loginSessionBean.setAuthSourceId(null);
              String postLoginRedirectUrl = loginSessionBean.getPostLoginRedirectUrl();
              
              switch (result.getStatus()) {
                case GRANT:
                  // User granted additional scopes in existing authentication source 
                break;
                case LOGIN:
                  // User logged in
                break;
                case NEW_ACCOUNT:
                  // User created new account
                break;
                case CONFLICT:
                  switch (result.getConflictReason()) {
                    case EMAIL_BELONGS_TO_ANOTHER_USER:
                      // Could not login, one or more of the email addresses belong to another user
                    break;
                    case LOGGED_IN_AS_DIFFERENT_USER:
                      // Could not login, user is already logged in as a another user
                    break;
                    case SEVERAL_USERS_BY_EMAILS:
                      // Could not login, several users found by email addresses
                    break;
                  }         
                  
                  // TODO: Proper error handling
                  throw new AuthenticationHandleException(result.getConflictReason().toString());
                case INVALID_CREDENTIALS:
                  throw new AuthenticationHandleException("Erroneous authentication provider status: INVALID_CREDENTIALS in external login page");
                case PROCESSING:
                  throw new AuthenticationHandleException("Erroneous authentication provider status: PROCESSING without redirectUrl");
              }
              
              if (StringUtils.isBlank(postLoginRedirectUrl)) {
                postLoginRedirectUrl = externalContext.getRequestContextPath() + "/";
              }
              
              externalContext.redirect(postLoginRedirectUrl);
            }
          } else {
            throw new AuthenticationHandleException("Invalid authenticationProvider");
          }
        } else {
          throw new AuthenticationHandleException("Invalid authSourceId");
        }
      }
    } catch (AuthenticationHandleException | IOException e) {
      return NavigationRules.INTERNAL_ERROR;
    }
    
    return null;
  }  
  
  public Long getAuthSourceId() {
    return authSourceId;
  }
  
  public void setAuthSourceId(Long authSourceId) {
    this.authSourceId = authSourceId;
  }
  
  public String getRedirectUrl() {
    return redirectUrl;
  }
  
  public void setRedirectUrl(String redirectUrl) {
    this.redirectUrl = redirectUrl;
  }
  
}
