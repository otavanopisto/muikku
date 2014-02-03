package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceFolder;

public class WorkspaceFolderUpdateEvent extends WorkspaceFolderEvent {

  public WorkspaceFolderUpdateEvent(WorkspaceFolder workspaceFolder) {
    super(workspaceFolder);
  }
  
}
