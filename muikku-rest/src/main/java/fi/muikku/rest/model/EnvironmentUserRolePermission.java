package fi.muikku.rest.model;

public class EnvironmentUserRolePermission {

  public EnvironmentUserRolePermission() {
  }

  public EnvironmentUserRolePermission(Long userRoleId, Long permissionId, Boolean permitted) {
    this.userRoleId = userRoleId;
    this.permissionId = permissionId;
    this.permitted = permitted;
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

  private Long userRoleId;
  private Long permissionId;
  private Boolean permitted;
}
