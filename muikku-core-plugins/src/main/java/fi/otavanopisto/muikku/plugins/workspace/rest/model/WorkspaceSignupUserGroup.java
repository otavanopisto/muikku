package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceSignupUserGroup {

  public WorkspaceSignupUserGroup() {
  }
  
  public WorkspaceSignupUserGroup(Long workspaceEntityId, Long userGroupEntityId, String userGroupName, Boolean canSignup) {
    this.workspaceEntityId = workspaceEntityId;
    this.userGroupEntityId = userGroupEntityId;
    this.userGroupName = userGroupName;
    this.canSignup = canSignup;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Long getUserGroupEntityId() {
    return userGroupEntityId;
  }

  public void setUserGroupEntityId(Long userGroupEntityId) {
    this.userGroupEntityId = userGroupEntityId;
  }

  public String getUserGroupName() {
    return userGroupName;
  }

  public void setUserGroupName(String userGroupName) {
    this.userGroupName = userGroupName;
  }

  public Boolean getCanSignup() {
    return canSignup;
  }

  public void setCanSignup(Boolean canSignup) {
    this.canSignup = canSignup;
  }

  private Long workspaceEntityId;
  private Long userGroupEntityId;
  private String userGroupName;
  private Boolean canSignup;

}
