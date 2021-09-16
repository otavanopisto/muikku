package fi.otavanopisto.muikku.rest.model;

import java.util.Set;

public class UserWhoAmIInfo extends UserBasicInfo {

  public UserWhoAmIInfo() {
  }

  public UserWhoAmIInfo(Long id,
              String identifier,
              String firstName,
              String lastName,
              String nickName, 
              String studyProgrammeName,
              boolean hasImage, 
              boolean hasEvaluationFees,
              String curriculumIdentifier,
              String organizationIdentifier,
              boolean isDefaultOrganization,
              Set<String> permissions,
              Set<String> roles) {
    super(id, identifier, firstName, lastName, nickName, hasImage);
    this.studyProgrammeName = studyProgrammeName;
    this.hasEvaluationFees = hasEvaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
    this.organizationIdentifier = organizationIdentifier;
    this.isDefaultOrganization = isDefaultOrganization;
    this.setPermissions(permissions);
    this.setRoles(roles);
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

  public Set<String> getPermissions() {
    return permissions;
  }

  public void setPermissions(Set<String> permissions) {
    this.permissions = permissions;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  private String identifier;
  private String studyProgrammeName;
  private boolean hasEvaluationFees;
  private String curriculumIdentifier;
  private String organizationIdentifier;
  private boolean isDefaultOrganization;
  private Set<String> permissions;
  private Set<String> roles;
}
