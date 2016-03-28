package fi.otavanopisto.muikku.plugins.guider;

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
@Join (path = "/guider", to = "/jsf/guider/index.jsf")
@LoggedIn
public class GuiderBackingBean {

  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {

    if (!sessionController.hasEnvironmentPermission(GuiderPermissions.GUIDER_VIEW)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    return null;
  }
  
}
