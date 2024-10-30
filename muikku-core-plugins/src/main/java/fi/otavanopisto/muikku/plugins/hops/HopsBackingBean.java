package fi.otavanopisto.muikku.plugins.hops;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.codec.binary.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/hops", to = "/jsf/records/index.jsf")
@LoggedIn
public class HopsBackingBean {
  
  @Inject
  private UserController userController;
  
  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasRole(EnvironmentRoleArchetype.STUDENT)) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    User user = userController.findUserByIdentifier(sessionController.getLoggedUser());
    if (user == null || (!StringUtils.equals("lukio", user.getStudyProgrammeEducationType()) && !StringUtils.equals("peruskoulu", user.getStudyProgrammeEducationType()))) {
      return NavigationRules.ACCESS_DENIED;
    }
    
    return null;
  }

}
