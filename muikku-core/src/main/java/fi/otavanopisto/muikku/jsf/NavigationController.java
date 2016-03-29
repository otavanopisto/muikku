package fi.otavanopisto.muikku.jsf;

import fi.otavanopisto.security.LoggedIn;

public class NavigationController {

  @LoggedIn
  public String requireLogin() {
    return null;
  }
  
}
