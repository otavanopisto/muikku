package fi.otavanopisto.muikku.plugins.evaluation;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.otavanopisto.muikku.jsf.NavigationRules;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation2", to = "/jsf/evaluation/main-view.jsf")
@LoggedIn
public class EvaluationMainViewBackingBean {

  @Parameter ("workspaceEntityId")
  @Matches ("[0-9]{1,}")
  private Long workspaceEntityId;

  private String workspaceName;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private WorkspaceController workspaceController;

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
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        return NavigationRules.NOT_FOUND;
      }
      setWorkspaceName(workspace.getName());
      if (!StringUtils.isEmpty(workspace.getNameExtension())) {
        setWorkspaceName(getWorkspaceName() + String.format(" (%s)", workspace.getNameExtension()));
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
    
    return null;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }
  
  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

}
