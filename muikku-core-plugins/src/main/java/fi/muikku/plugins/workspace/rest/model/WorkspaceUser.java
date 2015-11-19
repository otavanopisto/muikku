package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceUser {

  public WorkspaceUser() {
  }

  public WorkspaceUser(Long id, Long workspaceId, Long userId, String firstName, String lastName) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
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
  
  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private Long workspaceId;
  private Long userId;

}