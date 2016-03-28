package fi.otavanopisto.muikku.session;

import java.util.Date;

public class AccessToken {
  
  public AccessToken(String token, Date expires, String refreshToken) {
    this.token = token;
    this.expires = expires;
    this.refreshToken = refreshToken;
  }

  public String getToken() {
    return token;
  }
  
  public Date getExpires() {
    return expires;
  }
  
  public String getRefreshToken() {
    return refreshToken;
  }

  private String token;
  private Date expires;
  private String refreshToken;
}
