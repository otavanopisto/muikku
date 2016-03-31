package fi.otavanopisto.muikku.rest.model;

public class WorkspaceUserGroupPermission {

  public WorkspaceUserGroupPermission() {
  }
  
  public WorkspaceUserGroupPermission(Long workspaceId, Long userGroupId, Long permissionId, Boolean permitted) {
    this.workspaceId = workspaceId;
    this.userGroupId = userGroupId;
    this.permissionId = permissionId;
    this.permitted = permitted;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }
  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }
  public Long getUserGroupId() {
    return userGroupId;
  }
  public void setUserGroupId(Long userGroupId) {
    this.userGroupId = userGroupId;
  }
  public Long getPermissionId() {
    return permissionId;
  }
  public void setPermissionId(Long permissionId) {
    this.permissionId = permissionId;
  }
  public Boolean getPermitted() {
    return permitted;
  }
  public void setPermitted(Boolean permitted) {
    this.permitted = permitted;
  }

  Long workspaceId;
  Long userGroupId;
  Long permissionId;
  Boolean permitted;  
}
