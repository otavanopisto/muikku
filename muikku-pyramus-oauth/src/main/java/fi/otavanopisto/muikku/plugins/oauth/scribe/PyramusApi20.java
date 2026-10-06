package fi.otavanopisto.muikku.plugins.oauth.scribe;

import com.github.scribejava.core.builder.api.DefaultApi20;

public class PyramusApi20 extends DefaultApi20 {

  private final static String AUTHORIZATION_PATH = "/users/authorize.page";
  private final static String TOKEN_PATH = "/1/oauth/token";
  
  public PyramusApi20(String pyramusOrigin) {
    this.pyramusOrigin = pyramusOrigin;
  }
  
  @Override
  public String getAccessTokenEndpoint() {
    return pyramusOrigin + TOKEN_PATH;
  }

  @Override
  protected String getAuthorizationBaseUrl() {
    return pyramusOrigin + AUTHORIZATION_PATH;
  }
  
  private String pyramusOrigin;
}
