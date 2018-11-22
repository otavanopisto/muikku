package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceUserRestModel {

  public WorkspaceUserRestModel() {
  }

  public WorkspaceUserRestModel(Long workspaceUserEntityId, Long userEntityId, String firstName, String lastName) {
    this.workspaceUserEntityId = workspaceUserEntityId;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public Long getWorkspaceUserEntityId() {
    return workspaceUserEntityId;
  }

  public void setWorkspaceUserEntityId(Long workspaceUserEntityId) {
    this.workspaceUserEntityId = workspaceUserEntityId;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
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

  private Long workspaceUserEntityId;
  private Long userEntityId;
  private String firstName;
  private String lastName;

}