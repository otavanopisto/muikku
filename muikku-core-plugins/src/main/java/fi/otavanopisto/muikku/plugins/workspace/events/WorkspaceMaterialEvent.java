package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterial;

public abstract class WorkspaceMaterialEvent extends WorkspaceNodeEvent<WorkspaceMaterial> {

  public WorkspaceMaterialEvent(WorkspaceMaterial workspaceNode) {
    super(workspaceNode);
  }
  
}
