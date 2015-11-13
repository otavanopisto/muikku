package fi.muikku.plugins.workspace.rest.model;

public class WorkspaceUser {

  public WorkspaceUser() {
  }

  public WorkspaceUser(Long id, Long workspaceId, Long userId, Long roleId, String firstName, String lastName, String email) {
    super();
    this.id = id;
    this.workspaceId = workspaceId;
    this.userId = userId;
    this.roleId = roleId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.setEmail(email);
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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private String email;
  private Long workspaceId;
  private Long userId;
  private Long roleId;

}