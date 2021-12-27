package fi.otavanopisto.muikku.rest.model;

import java.time.OffsetDateTime;
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
              boolean isActive,
              Set<String> permissions,
              Set<String> roles,
              String displayName,
              String emails,
              String addresses,
              String phoneNumbers,
              String studyTimeLeftStr,
              OffsetDateTime studyStartDate,
              OffsetDateTime studyEndDate,
              OffsetDateTime studyTimeEnd
              ) {
    super(id, identifier, firstName, lastName, nickName, hasImage);
    this.studyProgrammeName = studyProgrammeName;
    this.hasEvaluationFees = hasEvaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
    this.organizationIdentifier = organizationIdentifier;
    this.isDefaultOrganization = isDefaultOrganization;
    this.isActive = isActive;
    this.setPermissions(permissions);
    this.setRoles(roles);
    this.displayName = displayName;
    this.emails = emails;
    this.addresses = addresses;
    this.phoneNumbers = phoneNumbers;
    this.studyTimeLeftStr = studyTimeLeftStr;
    this.setStudyStartDate(studyStartDate);
    this.setStudyEndDate(studyEndDate);
    this.setStudyTimeEnd(studyTimeEnd);
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

  public boolean getIsActive() {
    return isActive;
  }

  public void setIsActive(boolean isActive) {
    this.isActive = isActive;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getStudyTimeLeftStr() {
    return studyTimeLeftStr;
  }

  public void setStudyTimeLeftStr(String studyTimeLeftStr) {
    this.studyTimeLeftStr = studyTimeLeftStr;
  }

  public String getEmails() {
    return emails;
  }

  public void setEmails(String emails) {
    this.emails = emails;
  }

  public String getAddresses() {
    return addresses;
  }

  public void setAddresses(String addresses) {
    this.addresses = addresses;
  }

  public String getPhoneNumbers() {
    return phoneNumbers;
  }

  public void setPhoneNumbers(String phoneNumbers) {
    this.phoneNumbers = phoneNumbers;
  }

  public OffsetDateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(OffsetDateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public OffsetDateTime getStudyEndDate() {
    return studyEndDate;
  }

  public void setStudyEndDate(OffsetDateTime studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  public OffsetDateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(OffsetDateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  private String studyProgrammeName;
  private boolean hasEvaluationFees;
  private String curriculumIdentifier;
  private String organizationIdentifier;
  private boolean isDefaultOrganization;
  private Set<String> permissions;
  private Set<String> roles;
  private boolean isActive;
  private String displayName;
  private String emails;
  private String addresses;
  private String phoneNumbers;
  private String studyTimeLeftStr;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndDate;
  private OffsetDateTime studyTimeEnd;
  
}
