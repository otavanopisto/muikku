package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class WorkspaceMaterialFieldDeleteEvent extends WorkspaceMaterialFieldEvent {

  public WorkspaceMaterialFieldDeleteEvent(WorkspaceMaterialField workspaceMaterialField) {
    super(workspaceMaterialField);
  }

}
