package fi.otavanopisto.muikku.jsf;

import fi.otavanopisto.security.LoggedIn;

public class NavigationController {

  @LoggedIn
  public String requireLogin() {
    return null;
  }
  
  public String notFound() {
    return NavigationRules.NOT_FOUND;
  }
  
  public String accessDenied() {
    return NavigationRules.ACCESS_DENIED;
  }
  
  public String internalError() {
    return NavigationRules.INTERNAL_ERROR;
  }
  
  
}
