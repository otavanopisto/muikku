package fi.muikku.plugins.workspace;

import javax.inject.Inject;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.workspace.dao.WorkspaceToolSettingsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceToolSettings;

public class WorkspaceToolSettingsController {

  @Inject
  private WorkspaceToolSettingsDAO workspaceToolSettingsDAO;
  
  /* Tool visibility */

  public boolean getToolVisible(WorkspaceEntity workspaceEntity, String tool) {
    if (workspaceEntity != null) {
      WorkspaceToolSettings settings = workspaceToolSettingsDAO.findByWorkspaceEntityIdAndName(workspaceEntity.getId(), tool);
      if (settings != null) {
        return settings.getVisible();
      }
    }
    
    return true;
  }
  
}
