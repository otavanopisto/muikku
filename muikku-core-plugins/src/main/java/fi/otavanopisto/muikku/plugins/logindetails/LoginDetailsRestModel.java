package fi.otavanopisto.muikku.plugins.logindetails;

import java.util.Date;

public class LoginDetailsRestModel {

  public LoginDetailsRestModel() {
  }

  public LoginDetailsRestModel(String userIdentifier, String authenticationProvder, String address, Date time) {
    super();
    this.userIdentifier = userIdentifier;
    this.authenticationProvder = authenticationProvder;
    this.address = address;
    this.time = time;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public String getAuthenticationProvder() {
    return authenticationProvder;
  }

  public String getAddress() {
    return address;
  }

  public Date getTime() {
    return time;
  }

  private String userIdentifier;
  private String authenticationProvder;
  private String address;
  private Date time;
}
