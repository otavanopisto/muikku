package fi.muikku.plugins.guidancetool;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join (path = "/guider", to = "/jsf/guider/index.jsf")
@LoggedIn
public class GuidanceToolBackingBean {

  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {

    if (!sessionController.hasEnvironmentPermission(GuidanceToolPermissions.GUIDANCE_TOOL)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    return null;
  }
  
}
