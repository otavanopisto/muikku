package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.Workspace;

public class WorkspaceRESTModelController {

  @Inject
  private WorkspaceController workspaceController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  public WorkspaceBasicInfo workspaceBasicInfo(Long workspaceId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity != null) {
      Workspace workspace = workspaceController.findWorkspace(workspaceEntity);      

      if (workspace != null) {
        return new WorkspaceBasicInfo(
            workspaceEntity.getId(), 
            workspaceEntity.getUrlName(), 
            workspace.getName(), 
            workspace.getNameExtension());
      }
    }
    return null;
  }
}
