package fi.muikku.session;

import java.util.Date;

public class AccessToken {
  
  public AccessToken(String token, Date expires) {
    this.token = token;
    this.expires = expires;
  }

  public String getToken() {
    return token;
  }
  
  public Date getExpires() {
    return expires;
  }
  
  private String token;
  private Date expires;
}
