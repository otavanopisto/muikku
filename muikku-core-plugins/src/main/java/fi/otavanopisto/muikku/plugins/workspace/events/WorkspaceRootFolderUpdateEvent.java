package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRootFolder;

public class WorkspaceRootFolderUpdateEvent extends WorkspaceRootFolderEvent {

  public WorkspaceRootFolderUpdateEvent(WorkspaceRootFolder workspaceRootFolder) {
    super(workspaceRootFolder);
  }
  
}
