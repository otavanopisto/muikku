package fi.otavanopisto.muikku.session;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

import fi.otavanopisto.security.ContextReference;
import fi.otavanopisto.security.Identity;

@SessionScoped
@Stateful
public class IdentityImpl implements Identity {

  @Inject
  private SessionController sessionController;
  
  @Override
  public boolean isLoggedIn() {
    return sessionController.isLoggedIn();
  }

  @Override
  public boolean isAdmin() {
    return sessionController.isSuperuser();
  }

  @Override
  public boolean hasPermission(String permission, ContextReference contextReference) {
    return sessionController.hasPermission(permission, contextReference);
  }

}
