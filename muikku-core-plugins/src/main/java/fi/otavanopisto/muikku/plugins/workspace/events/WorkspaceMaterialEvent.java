package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public abstract class WorkspaceMaterialEvent extends WorkspaceNodeEvent<WorkspaceMaterial> {

  public WorkspaceMaterialEvent(WorkspaceMaterial workspaceNode) {
    super(workspaceNode);
  }
  
}
