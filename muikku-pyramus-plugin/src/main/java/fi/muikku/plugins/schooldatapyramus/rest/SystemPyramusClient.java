package fi.muikku.plugins.schooldatapyramus.rest;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import org.joda.time.DateTime;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  private static String AUTH_CODE = "ff81d5b8500c773e7a1776a7963801e3";
  
  @PostConstruct
  public void init() {
    accessToken = null;
    accessTokenExpires = null;
  }
  
  @Override
  protected synchronized String getAccessToken() {
    if (((accessToken == null) || (accessTokenExpires == null)) || (accessTokenExpires.isBefore(System.currentTimeMillis()))) {
      AccessToken createdAccessToken = createAccessToken(AUTH_CODE);
      accessToken = createdAccessToken.getAccessToken();
      accessTokenExpires = new DateTime().plusSeconds(createdAccessToken.getExpiresIn());
    }
    
    // TODO: Change to refresh token when such is available in Pyramus
    
    return accessToken;
  }

  private String accessToken;
  private DateTime accessTokenExpires;
  
}
