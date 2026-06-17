package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.model.workspace.WorkspaceFolder;

public class WorkspaceFolderCreateEvent extends WorkspaceFolderEvent {

  public WorkspaceFolderCreateEvent(WorkspaceFolder workspaceFolder) {
    super(workspaceFolder);
  }
  
}
