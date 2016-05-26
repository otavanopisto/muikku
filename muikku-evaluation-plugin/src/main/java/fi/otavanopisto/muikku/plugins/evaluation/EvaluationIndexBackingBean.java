package fi.otavanopisto.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation", to = "/jsf/evaluation/index.jsf")
@LoggedIn
public class EvaluationIndexBackingBean {
  
  @Parameter ("workspaceEntityId")
  @Matches ("[0-9]{1,}")
  private Long workspaceEntityId;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @RequestAction
  public String init() {
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    
    if (userEntity == null) {
      return NavigationRules.ACCESS_DENIED;
    }

    WorkspaceEntity workspaceEntity = null;
    if (workspaceEntityId != null) {
      workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        return NavigationRules.NOT_FOUND;
      }
    }
    
    if (workspaceEntity == null) {
      if (!sessionController.hasEnvironmentPermission(EvaluationResourcePermissionCollection.EVALUATION_VIEW_INDEX)) {
        return NavigationRules.ACCESS_DENIED; 
      }
    }
    else {
      if (!sessionController.hasWorkspacePermission(EvaluationResourcePermissionCollection.EVALUATION_VIEW_INDEX, workspaceEntity)) {
        return NavigationRules.ACCESS_DENIED; 
      }
    }

    listAllWorkspaces = sessionController.hasEnvironmentPermission(EvaluationResourcePermissionCollection.EVALUATION_LIST_ALL_WORKSPACES);

    return null;
  }
  
  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Boolean getListAllWorkspaces() {
    return listAllWorkspaces;
  }

  private boolean listAllWorkspaces;

}
