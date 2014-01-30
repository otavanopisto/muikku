package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceMaterial;

public class WorkspaceMaterialCreateEvent extends WorkspaceMaterialEvent {

  public WorkspaceMaterialCreateEvent(WorkspaceMaterial workspaceMaterial) {
    super(workspaceMaterial);
  }
  
}
