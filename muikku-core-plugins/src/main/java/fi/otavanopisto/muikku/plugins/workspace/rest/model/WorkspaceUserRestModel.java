package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceUserRestModel {

  public WorkspaceUserRestModel() {
  }

  public WorkspaceUserRestModel(Long workspaceUserEntityId, Long userEntityId, String firstName, String lastName, String studyProgrammeName) {
    this.workspaceUserEntityId = workspaceUserEntityId;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgrammeName = studyProgrammeName;
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

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  private Long workspaceUserEntityId;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String studyProgrammeName;

}