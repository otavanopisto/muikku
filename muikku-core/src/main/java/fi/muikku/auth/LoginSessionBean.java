package fi.muikku.auth;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;

import org.scribe.model.Token;

@SessionScoped
@Stateful
public class LoginSessionBean {

  public Token getRequestToken() {
    return requestToken;
  }
  
  public void setRequestToken(Token requestToken) {
    this.requestToken = requestToken;
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
  
  private Token requestToken;
  private String[] requestedScopes;
  private Long authSourceId;
}
