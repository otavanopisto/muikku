package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceFolder;

public abstract class WorkspaceFolderEvent extends WorkspaceNodeEvent<WorkspaceFolder> {

  public WorkspaceFolderEvent(WorkspaceFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
