package fi.otavanopisto.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.security.MuikkuPermissions;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
//TODO Remove this file and its xhtml completely
//@Join(path = "/evaluation", to = "/jsf/evaluation/index.jsf") // TODO refactor to /evaluation
@LoggedIn
public class EvaluationMainViewBackingBean {

  @Inject
  private SessionController sessionController;
  
  @RequestAction
  public String init() {
    if (!sessionController.hasEnvironmentPermission(MuikkuPermissions.ACCESS_EVALUATION)) {
      return NavigationRules.ACCESS_DENIED;
    }
    return null;
  }

}
