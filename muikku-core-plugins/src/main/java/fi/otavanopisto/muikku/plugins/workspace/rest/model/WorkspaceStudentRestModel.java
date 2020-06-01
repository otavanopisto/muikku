package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceStudentRestModel extends WorkspaceUserRestModel {

  public WorkspaceStudentRestModel() {
  }

  public WorkspaceStudentRestModel(Long workspaceUserEntityId, Long userEntityId, String firstName, String lastName, String studyProgrammeName, Boolean active) {
    super(workspaceUserEntityId, userEntityId, firstName, lastName);
    this.studyProgrammeName = studyProgrammeName;
    this.active = active;
  }

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }

  private String studyProgrammeName;
  private Boolean active;

}