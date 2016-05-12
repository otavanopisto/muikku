package fi.otavanopisto.muikku.plugins.evaluation;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;

@Named
@Stateful
@RequestScoped
public class EvaluationWidgetBackingBean {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private EnvironmentUserController environmentUserController;
  
  @PostConstruct
  public void init() {
    visible = false;
    
    if (sessionController.isLoggedIn()) {
      EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(sessionController.getLoggedUserEntity());
      if ((environmentUser != null) && (environmentUser.getRole() != null)) {
        EnvironmentRoleArchetype roleArchetype = environmentUser.getRole().getArchetype();
        switch (roleArchetype) {
          case TEACHER:
          case ADMINISTRATOR:
          case MANAGER:
          case STUDY_PROGRAMME_LEADER:
            visible = true;
          break;
          default:
          break;
        }
      }
    }
  }
  
  public Boolean getVisible() {
    return visible;
  }
  
  private Boolean visible;
}
