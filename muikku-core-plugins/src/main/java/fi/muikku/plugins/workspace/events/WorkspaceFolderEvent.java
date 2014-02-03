package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.muikku.plugins.workspace.model.WorkspaceFolder;

public abstract class WorkspaceFolderEvent extends WorkspaceNodeEvent<WorkspaceFolder> {

  public WorkspaceFolderEvent(WorkspaceFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
