package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceRootFolder;

public class WorkspaceRootFolderCreateEvent extends WorkspaceRootFolderEvent {

  public WorkspaceRootFolderCreateEvent(WorkspaceRootFolder workspaceRootFolder) {
    super(workspaceRootFolder);
  }
  
}
