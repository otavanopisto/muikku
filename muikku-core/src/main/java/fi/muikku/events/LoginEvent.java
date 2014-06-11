package fi.muikku.events;

import java.io.Serializable;

public class LoginEvent implements Serializable {

  private static final long serialVersionUID = 1L;

  public LoginEvent(long userEntityId, String userAuthSource, String userIPAddr) {
    this.setUserEntityId(userEntityId);
    this.setUserAuthSource(userAuthSource);
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

  public String getUserAuthSource() {
    return userAuthSource;
  }

  public void setUserAuthSource(String userAuthSource) {
    this.userAuthSource = userAuthSource;
  }

  private long userEntityId;
  private String userAuthSource;
  private String userIPAddr;

}
