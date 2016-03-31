package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class WorkspaceMaterialCreateEvent extends WorkspaceMaterialEvent {

  public WorkspaceMaterialCreateEvent(WorkspaceMaterial workspaceMaterial) {
    super(workspaceMaterial);
  }
  
}
