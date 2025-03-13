package fi.otavanopisto.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join (path = "/announcer", to = "/jsf/announcer/index.jsf")
public class AnnouncerBackingBean {

  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  @LoggedIn
  public String init() {
    if (!sessionController.hasEnvironmentPermission(AnnouncerPermissions.ANNOUNCER_TOOL)) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }

}
