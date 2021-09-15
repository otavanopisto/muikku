package fi.otavanopisto.muikku.rest.model;

public class UserWhoAmIInfo extends UserBasicInfo {

  public UserWhoAmIInfo() {
  }

  public UserWhoAmIInfo(Long id,
              String firstName,
              String lastName,
              String nickName, 
              String studyProgrammeName,
              boolean hasImage, 
              boolean hasEvaluationFees,
              String curriculumIdentifier,
              String organizationIdentifier,
              boolean isDefaultOrganization) {
    super(id, firstName, lastName, nickName, hasImage);
    this.studyProgrammeName = studyProgrammeName;
    this.hasEvaluationFees = hasEvaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
    this.organizationIdentifier = organizationIdentifier;
    this.isDefaultOrganization = isDefaultOrganization;
  }

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }
  
  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public boolean getHasEvaluationFees() {
    return this.hasEvaluationFees;
  }

  public void setHasEvaluationFees(boolean hasEvaluationFees) {
    this.hasEvaluationFees = hasEvaluationFees;
  }

  public String getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(String curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public String getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  public void setOrganizationIdentifier(String organizationIdentifier) {
    this.organizationIdentifier = organizationIdentifier;
  }

  public boolean getIsDefaultOrganization() {
    return isDefaultOrganization;
  }

  public void setIsDefaultOrganization(boolean isDefaultOrganization) {
    this.isDefaultOrganization = isDefaultOrganization;
  }

  private String studyProgrammeName;
  private boolean hasEvaluationFees;
  private String curriculumIdentifier;
  private String organizationIdentifier;
  private boolean isDefaultOrganization;
}
