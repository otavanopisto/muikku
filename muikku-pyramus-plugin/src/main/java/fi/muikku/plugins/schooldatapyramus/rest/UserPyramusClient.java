package fi.muikku.plugins.schooldatapyramus.rest;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;

import org.joda.time.DateTime;

@SessionScoped
public class UserPyramusClient extends AbstractPyramusClient implements Serializable {

  private static final long serialVersionUID = -2643693371146903250L;

  @PostConstruct
  public void init() {
    accessToken = null;
    accessTokenExpires = null;
  }
  
  @Override
  protected synchronized String getAccessToken() {
    if (((accessToken == null) || (accessTokenExpires == null)) || (accessTokenExpires.isBefore(System.currentTimeMillis()))) {
      AccessToken createdAccessToken = createAccessToken();
      accessToken = createdAccessToken.getAccessToken();
      accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
    }
    
    // TODO: Change to refresh token when such is available in Pyramus
    
    return accessToken;
  }

  private String accessToken;
  private DateTime accessTokenExpires;
}
