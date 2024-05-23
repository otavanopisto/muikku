package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.List;

public class WorkspaceSignupUserGroupListRestModel {

  public List<WorkspaceSignupUserGroup> getWorkspaceSignupGroups() {
    return workspaceSignupGroups;
  }

  public void setWorkspaceSignupGroups(List<WorkspaceSignupUserGroup> workspaceSignupGroups) {
    this.workspaceSignupGroups = workspaceSignupGroups;
  }
  
  private List<WorkspaceSignupUserGroup> workspaceSignupGroups;
}
