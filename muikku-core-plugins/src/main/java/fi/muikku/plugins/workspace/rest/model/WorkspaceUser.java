package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceUser {

  public WorkspaceUser() {
  }

  public WorkspaceUser(String id, Long workspaceId, Long userId, String firstName, String lastName, Boolean active) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.active = active;
  }

  public String getId() {
    return id;
  }
  
  public void setId(String id) {
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
  
  public Boolean getActive() {
    return active;
  }
  
  public void setActive(Boolean active) {
    this.active = active;
  }

  private String id;
  private String firstName;
  private String lastName;
  private Long workspaceId;
  private Long userId;
  private Boolean active;

}