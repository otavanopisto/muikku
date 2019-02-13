package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceStudentRestModel extends WorkspaceUserRestModel {

  public WorkspaceStudentRestModel() {
  }

  public WorkspaceStudentRestModel(Long workspaceUserEntityId, Long userEntityId, String firstName, String nickname, String lastName, String studyProgrammeName, Boolean hasImage, Boolean active) {
    super(workspaceUserEntityId, userEntityId, firstName, lastName);
    this.studyProgrammeName = studyProgrammeName;
    this.nickname = nickname;
    this.hasImage = hasImage;
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

  public String getNickname() {
    return nickname;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public Boolean getHasImage() {
    return hasImage;
  }

  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  private String nickname;
  private String studyProgrammeName;
  private Boolean active;
  private Boolean hasImage;

}