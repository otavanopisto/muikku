package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.events.WorkspaceNodeEvent;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceRootFolder;

public abstract class WorkspaceRootFolderEvent extends WorkspaceNodeEvent<WorkspaceRootFolder> {

  public WorkspaceRootFolderEvent(WorkspaceRootFolder workspaceNode) {
    super(workspaceNode);
  }
  
}
