package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceUser {

  public WorkspaceUser() {
  }

  public WorkspaceUser(Long id, Long workspaceId, Long userId, Long roleId, Boolean archived) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.roleId = roleId;
    this.archived = archived;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getWorkspaceId() {
    return workspaceId;
  }

  public void setWorkspaceId(Long workspaceId) {
    this.workspaceId = workspaceId;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }
  
  public Long getRoleId() {
    return roleId;
  }
  
  public void setRoleId(Long roleId) {
    this.roleId = roleId;
  }

  public Boolean getArchived() {
    return archived;
  }

  public void setArchived(Boolean archived) {
    this.archived = archived;
  }

  private Long id;
  private Long workspaceId;
  private Long userId;
  private Long roleId;
  private Boolean archived;
}