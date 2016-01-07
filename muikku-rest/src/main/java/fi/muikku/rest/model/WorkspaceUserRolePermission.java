package fi.muikku.rest.model;

public class WorkspaceUserRolePermission {

  public WorkspaceUserRolePermission() {
  }

  public WorkspaceUserRolePermission(Long workspaceId, Long userRoleId, Long permissionId, Boolean permitted) {
    this.workspaceId = workspaceId;
    this.userRoleId = userRoleId;
    this.permissionId = permissionId;
    this.permitted = permitted;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public Long getUserRoleId() {
    return userRoleId;
  }

  public void setUserRoleId(Long userRoleId) {
    this.userRoleId = userRoleId;
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

  private Long workspaceId;
  private Long userRoleId;
  private Long permissionId;
  private Boolean permitted;
}
