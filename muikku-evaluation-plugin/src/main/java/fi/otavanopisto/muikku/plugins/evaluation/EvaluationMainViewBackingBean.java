package fi.otavanopisto.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation2", to = "/jsf/evaluation/main-view.jsf")
@LoggedIn
public class EvaluationMainViewBackingBean {
  
  @Inject
  private SessionController sessionController;

  @RequestAction
  public String init() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    if (userEntity == null) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }

}
