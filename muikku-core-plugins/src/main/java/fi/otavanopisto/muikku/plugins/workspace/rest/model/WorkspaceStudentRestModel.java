package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceStudentRestModel extends WorkspaceUserRestModel {

  public WorkspaceStudentRestModel() {
  }

  public WorkspaceStudentRestModel(Long workspaceUserEntityId, Long userEntityId, SchoolDataIdentifier userIdentifier, String firstName, String nickname, String lastName, String studyProgrammeName, Boolean hasImage, Boolean active, Boolean hasPedagogyForm) {
    super(workspaceUserEntityId, userEntityId, userIdentifier, firstName, lastName, hasImage);
    this.studyProgrammeName = studyProgrammeName;
    this.nickname = nickname;
    this.active = active;
    this.hasPedagogyForm = hasPedagogyForm;
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

  public Boolean getHasPedagogyForm() {
    return hasPedagogyForm;
  }

  public void setHasPedagogyForm(Boolean hasPedagogyForm) {
    this.hasPedagogyForm = hasPedagogyForm;
  }

  private String nickname;
  private String studyProgrammeName;
  private Boolean active;
  private Boolean hasPedagogyForm;
 
}