package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;

public abstract class WorkspaceFolderEvent extends WorkspaceNodeEvent<WorkspaceFolder> {

  public WorkspaceFolderEvent(WorkspaceFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
