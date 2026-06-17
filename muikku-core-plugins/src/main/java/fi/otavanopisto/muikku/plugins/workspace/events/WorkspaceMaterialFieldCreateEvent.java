package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceMaterialField;

public class WorkspaceMaterialFieldCreateEvent extends WorkspaceMaterialFieldEvent {

  public WorkspaceMaterialFieldCreateEvent(WorkspaceMaterialField workspaceMaterialField) {
    super(workspaceMaterialField);
  }

}
