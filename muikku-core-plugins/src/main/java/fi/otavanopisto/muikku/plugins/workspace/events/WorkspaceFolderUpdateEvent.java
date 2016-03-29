package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;

public class WorkspaceFolderUpdateEvent extends WorkspaceFolderEvent {

  public WorkspaceFolderUpdateEvent(WorkspaceFolder workspaceFolder) {
    super(workspaceFolder);
  }
  
}
