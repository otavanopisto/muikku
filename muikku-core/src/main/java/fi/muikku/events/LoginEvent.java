package fi.muikku.events;

import java.io.Serializable;

import fi.muikku.auth.AuthenticationProvider;
import fi.muikku.schooldata.SchoolDataIdentifier;

public class LoginEvent implements Serializable {

  private static final long serialVersionUID = 1L;

  public LoginEvent(long userEntityId, SchoolDataIdentifier userIdentifier, AuthenticationProvider authProvider, String userIPAddr) {
    this.setUserEntityId(userEntityId);
    this.setUserIdentifier(userIdentifier);
    this.setAuthProvider(authProvider);
    this.setUserIPAddr(userIPAddr);
  }

  public long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(long userEntityId) {
    this.userEntityId = userEntityId;
  }
  
  public SchoolDataIdentifier getUserIdentifier() {
    return userIdentifier;
  }
  
  public void setUserIdentifier(SchoolDataIdentifier userIdentifier) {
    this.userIdentifier = userIdentifier;
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
  private SchoolDataIdentifier userIdentifier;
  private AuthenticationProvider authProvider;
  private String userIPAddr;

}
