package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceFolder;

public class WorkspaceFolderCreateEvent extends WorkspaceFolderEvent {

  public WorkspaceFolderCreateEvent(WorkspaceFolder workspaceFolder) {
    super(workspaceFolder);
  }
  
}
