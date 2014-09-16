package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceUser {

  public WorkspaceUser() {
  }

  public WorkspaceUser(Long id, Long workspaceId, Long userId, String role, Boolean archived) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.role = role;
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

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
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
  private String role;
  private Boolean archived;
}