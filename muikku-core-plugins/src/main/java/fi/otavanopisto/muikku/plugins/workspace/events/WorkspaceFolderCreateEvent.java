package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceFolder;

public class WorkspaceFolderCreateEvent extends WorkspaceFolderEvent {

  public WorkspaceFolderCreateEvent(WorkspaceFolder workspaceFolder) {
    super(workspaceFolder);
  }
  
}
