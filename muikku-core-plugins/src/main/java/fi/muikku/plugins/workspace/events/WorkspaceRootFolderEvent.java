package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

public abstract class WorkspaceRootFolderEvent extends WorkspaceNodeEvent<WorkspaceRootFolder> {

  public WorkspaceRootFolderEvent(WorkspaceRootFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
