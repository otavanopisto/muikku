package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public abstract class WorkspaceMaterialEvent extends WorkspaceNodeEvent<WorkspaceMaterial> {

  public WorkspaceMaterialEvent(WorkspaceMaterial workspaceNode) {
    super(workspaceNode);
  }
  
}
