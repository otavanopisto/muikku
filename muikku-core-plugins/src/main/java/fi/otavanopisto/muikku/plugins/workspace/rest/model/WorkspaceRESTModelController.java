package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import javax.inject.Inject;

import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.workspaces.WorkspaceEntityName;

public class WorkspaceRESTModelController {

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  public WorkspaceBasicInfo workspaceBasicInfo(Long workspaceId) {
    WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceId);
    if (workspaceEntity != null) {
      WorkspaceEntityName workspaceName = workspaceEntityController.getName(workspaceEntity);
      if (workspaceName != null) {
        return new WorkspaceBasicInfo(
            workspaceEntity.getId(), 
            workspaceEntity.getUrlName(), 
            workspaceName.getName(), 
            workspaceName.getNameExtension());
      }
    }
    return null;
  }

}
