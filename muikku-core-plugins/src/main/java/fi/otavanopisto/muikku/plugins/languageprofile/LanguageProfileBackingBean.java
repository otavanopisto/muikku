package fi.otavanopisto.muikku.plugins.languageprofile;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/languageprofile", to = "/jsf/language-profile/index.jsf")
@LoggedIn
public class LanguageProfileBackingBean {
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }

}
