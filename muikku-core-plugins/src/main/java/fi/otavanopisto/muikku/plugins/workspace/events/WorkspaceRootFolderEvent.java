package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRootFolder;

public abstract class WorkspaceRootFolderEvent extends WorkspaceNodeEvent<WorkspaceRootFolder> {

  public WorkspaceRootFolderEvent(WorkspaceRootFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
