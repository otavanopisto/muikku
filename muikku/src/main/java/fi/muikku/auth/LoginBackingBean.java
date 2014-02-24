package fi.muikku.auth;

import java.io.IOException;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;
import javax.faces.event.ComponentSystemEvent;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;

import com.ocpsoft.pretty.faces.annotation.URLMapping;
import com.ocpsoft.pretty.faces.annotation.URLMappings;

import fi.muikku.model.security.AuthSource;

@RequestScoped
@Named
@URLMappings(mappings = { @URLMapping(id = "login", pattern = "/login", viewId = "/login.jsf") })
public class LoginBackingBean {

  @Inject
  private AuthSourceController authSourceController;
  
  @Inject
  private LoginSessionBean loginSessionBean;
  
  public void preRenderViewListener(ComponentSystemEvent event) throws AuthenticationHandleException, IOException {
    FacesContext facesContext = FacesContext.getCurrentInstance();
    ExternalContext externalContext = facesContext.getExternalContext();
    Map<String, String[]> requestParameters = externalContext.getRequestParameterValuesMap();
    
    Long authSourceId = loginSessionBean.getAuthSourceId();
    String authSourceIdParam = externalContext.getRequestParameterMap().get("authSourceId");
    if (StringUtils.isNumeric(authSourceIdParam)) {
      authSourceId = NumberUtils.createLong(authSourceIdParam);
      loginSessionBean.setAuthSourceId(authSourceId);
    } 
    
    String redirectUrl = externalContext.getRequestParameterMap().get("redirectUrl");
    if (StringUtils.isNotBlank(redirectUrl)) {
      loginSessionBean.setPostLoginRedirectUrl(redirectUrl);
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
              break;
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
  }  
  
}
