package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class WorkspaceMaterialDeleteEvent extends WorkspaceMaterialEvent {

  public WorkspaceMaterialDeleteEvent(WorkspaceMaterial workspaceMaterial) {
    super(workspaceMaterial);
  }
  
}
