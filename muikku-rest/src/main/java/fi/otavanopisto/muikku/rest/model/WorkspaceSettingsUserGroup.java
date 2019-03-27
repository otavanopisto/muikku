package fi.otavanopisto.muikku.rest.model;

import java.util.ArrayList;
import java.util.List;

public class WorkspaceSettingsUserGroup {

  public WorkspaceSettingsUserGroup() {
  }
  
  public WorkspaceSettingsUserGroup(Long workspaceEntityId, Long userGroupEntityId, String userGroupName) {
    this.workspaceEntityId = workspaceEntityId;
    this.userGroupEntityId = userGroupEntityId;
    this.userGroupName = userGroupName;
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

  public void addPermission(String permission) {
    this.permissions.add(permission);
  }

  public List<String> getPermissions() {
    return permissions;
  }

  public void setPermissions(List<String> permissions) {
    this.permissions = permissions;
  }

  public String getUserGroupName() {
    return userGroupName;
  }

  public void setUserGroupName(String userGroupName) {
    this.userGroupName = userGroupName;
  }

  private Long workspaceEntityId;
  private Long userGroupEntityId;
  private String userGroupName;
  private List<String> permissions = new ArrayList<>();
}
