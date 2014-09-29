package fi.muikku.plugins.schooldatapyramus.rest;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  private static String AUTH_CODE = "ff81d5b8500c773e7a1776a7963801e3";
  
  
  @Override
  protected String getAccessToken() {
    // TODO: Replace with actual implementation
    return createAccessToken(AUTH_CODE).getAccessToken();
  }
  
}
