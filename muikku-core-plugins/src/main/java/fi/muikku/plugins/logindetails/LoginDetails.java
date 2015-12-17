package fi.muikku.plugins.logindetails;

import java.util.Date;

import fi.muikku.schooldata.SchoolDataIdentifier;

public class LoginDetails {

  public LoginDetails() {
  }

  public LoginDetails(SchoolDataIdentifier userIdentifier, String authenticationProvder, String address, Date time) {
    super();
    this.userIdentifier = userIdentifier;
    this.authenticationProvder = authenticationProvder;
    this.address = address;
    this.time = time;
  }

  public SchoolDataIdentifier getUserIdentifier() {
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

  private SchoolDataIdentifier userIdentifier;
  private String authenticationProvder;
  private String address;
  private Date time;
}
