package fi.muikku.plugins.credentiallogin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.faces.application.FacesMessage;
import javax.faces.context.FacesContext;
import javax.faces.model.SelectItem;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.auth.AuthSourceController;
import fi.muikku.auth.AuthenticationHandleException;
import fi.muikku.auth.AuthenticationProvider;
import fi.muikku.auth.AuthenticationResult;
import fi.muikku.i18n.LocaleController;
import fi.muikku.model.security.AuthSource;
import fi.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
public class CredentialLoginWidgetBackingBean {

  @Inject
  private AuthSourceController authSourceController;

  @Inject
  private LocaleController localeController;
  
  @Inject
  private SessionController sessionController;

  @PostConstruct
  public void init() {
    List<AuthSource> authSources = authSourceController.listCredentialAuthSources();
    if (!authSources.isEmpty()) {
      singleSource = authSources.size() == 1;
      
      sourceSelectItems = new ArrayList<>();
      for (AuthSource authSource : authSources) {
        sourceSelectItems.add(new SelectItem(authSource.getId(), authSource.getName()));
      }
      
      authSourceId = authSources.get(0).getId();
    } else {
      // TODO: Proper error handling
    }
  }

  public List<SelectItem> getSourceSelectItems() {
    return sourceSelectItems;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Long getAuthSourceId() {
    return authSourceId;
  }

  public void setAuthSourceId(Long authSourceId) {
    this.authSourceId = authSourceId;
  }
  
  public boolean isSingleSource() {
    return singleSource;
  }
  
  public void login() throws AuthenticationHandleException {
    AuthSource authSource = authSourceController.findAuthSourceById(authSourceId);
    if (authSource != null) {
      AuthenticationProvider authenticationProvider = authSourceController.findAuthenticationProvider(authSource);
      if (authenticationProvider != null) {
        Map<String, String[]> requestParameters = new HashMap<String, String[]>();
        requestParameters.put("email", new String[] { getEmail() });
        requestParameters.put("password", new String[] { getPassword() });

        AuthenticationResult result = authenticationProvider.processLogin(authSource, requestParameters);
        switch (result.getStatus()) {
          case NEW_ACCOUNT:
            // TODO: First time the user logged in
          break;
          case LOGIN:
            // TODO: User logged in
          break;
          case INVALID_CREDENTIALS:
            FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(localeController.getText(sessionController.getLocale(), "plugin.credentialLogin.invalidCredentials")));
          break;
          default:
            throw new AuthenticationHandleException("Invalid authentication status:" + result.getStatus());
        }
      } else {
        throw new AuthenticationHandleException("Invalid authenticationProvider");
      }
    } else {
      throw new AuthenticationHandleException("Invalid authSourceId");
    }
  }

  private String email;
  private String password;
  private Long authSourceId;
  private boolean singleSource;
  private List<SelectItem> sourceSelectItems;
}
