package fi.otavanopisto.muikku.plugins.announcer;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@Stateful
@RequestScoped
@Join (path = "/announcer", to = "/jsf/announcer/index.jsf")
public class AnnouncerBackingBean {

  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    if (userEntity == null) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    if (!sessionController.hasEnvironmentPermission(AnnouncerPermissions.ANNOUNCER_TOOL)) {
      return NavigationRules.ACCESS_DENIED;
    }

    return null;
  }

}
