package fi.muikku.plugins.evaluation;

import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;
import org.ocpsoft.rewrite.annotation.Matches;
import org.ocpsoft.rewrite.annotation.Parameter;
import org.ocpsoft.rewrite.annotation.RequestAction;

import fi.muikku.jsf.NavigationRules;
import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.WorkspaceController;
import fi.muikku.schooldata.entity.Workspace;
import fi.otavanopisto.security.LoggedIn;

@Named
@Stateful
@RequestScoped
@Join(path = "/evaluation", to = "/jsf/evaluation/index.jsf")
@LoggedIn
public class EvaluationIndexBackingBean {
  
  @Inject
  private Logger logger;
  
  @Parameter ("workspaceEntityId")
  @Matches ("[0-9]{1,}")
  private Long workspaceEntityId;

  @Inject
  private WorkspaceController workspaceController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @RequestAction
  public String init() {
    if (getWorkspaceEntityId() == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    WorkspaceEntity workspaceEntity = workspaceController.findWorkspaceEntityById(getWorkspaceEntityId());
    if (workspaceEntity == null) {
      return NavigationRules.NOT_FOUND;
    }
    
    schoolDataBridgeSessionController.startSystemSession();
    try {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);
      if (workspace == null) {
        logger.warning(String.format("Could not find workspace for workspaceEntity #%d", workspaceEntity.getId()));
        return NavigationRules.NOT_FOUND;
      }
      
      workspaceName = workspace.getName();
    } finally {
      schoolDataBridgeSessionController.endSystemSession();
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
 
  private String workspaceName;
}
