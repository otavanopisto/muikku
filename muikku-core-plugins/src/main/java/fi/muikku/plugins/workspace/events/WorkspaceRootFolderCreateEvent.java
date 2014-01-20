package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceRootFolder;

public class WorkspaceRootFolderCreateEvent extends WorkspaceRootFolderEvent {

  public WorkspaceRootFolderCreateEvent(WorkspaceRootFolder workspaceRootFolder) {
    super(workspaceRootFolder);
  }
  
}
