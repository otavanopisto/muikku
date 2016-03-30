package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;

public abstract class WorkspaceMaterialFieldEvent {
  
  public WorkspaceMaterialFieldEvent(WorkspaceMaterialField workspaceMaterialField) {
    this.workspaceMaterialField = workspaceMaterialField;
  }
  
  public WorkspaceMaterialField getWorkspaceMaterialField() {
    return workspaceMaterialField;
  }

  private WorkspaceMaterialField workspaceMaterialField;
}
