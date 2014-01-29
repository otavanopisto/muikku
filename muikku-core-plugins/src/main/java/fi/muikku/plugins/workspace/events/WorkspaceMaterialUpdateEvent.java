package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class WorkspaceMaterialUpdateEvent extends WorkspaceMaterialEvent {

  public WorkspaceMaterialUpdateEvent(WorkspaceMaterial workspaceMaterial) {
    super(workspaceMaterial);
  }
  
}
