package fi.otavanopisto.muikku.plugins.communicator;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.session.CurrentUserSession;
import fi.otavanopisto.security.LoggedIn;

@Named
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/communicator", to = "/jsf/communicator/index.jsf")
@LoggedIn
public class CommunicatorIndexBackingBean {

  @Inject
  private CurrentUserSession currentUserSession;
  
  @RequestAction
  public String init() {
    if (!currentUserSession.isActive()) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }
    
}