package fi.muikku.events;

import java.io.Serializable;

import fi.muikku.auth.AuthenticationProvider;

public class LoginEvent implements Serializable {

  private static final long serialVersionUID = 1L;

  public LoginEvent(long userEntityId, AuthenticationProvider authProvider, String userIPAddr) {
    this.setUserEntityId(userEntityId);
    this.setAuthProvider(authProvider);
    this.setUserIPAddr(userIPAddr);
  }

  public long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getUserIPAddr() {
    return userIPAddr;
  }

  public void setUserIPAddr(String userIPAddr) {
    this.userIPAddr = userIPAddr;
  }

  public AuthenticationProvider getAuthProvider() {
    return authProvider;
  }

  public void setAuthProvider(AuthenticationProvider authProvider) {
    this.authProvider = authProvider;
  }

  private long userEntityId;
  private AuthenticationProvider authProvider;
  private String userIPAddr;

}
