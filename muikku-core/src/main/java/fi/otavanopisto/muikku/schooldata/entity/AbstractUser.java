package fi.otavanopisto.muikku.schooldata.entity;

import java.time.OffsetDateTime;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public abstract class AbstractUser implements User {
  
  public AbstractUser(String identifier, String firstName, String lastName, String ssn, String nickName, String displayName,
      String studyProgrammeName, SchoolDataIdentifier studyProgrammeIdentifier, String nationality, String language, String municipality, String school,
      OffsetDateTime studyStartDate, OffsetDateTime studyEndDate, OffsetDateTime studyTimeEnd, boolean hidden, 
      boolean evaluationFees, String curriculumIdentifier, SchoolDataIdentifier organizationIdentifier) {
    super();
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.ssn = ssn;
    this.nickName = nickName;
    this.displayName = displayName;
    this.studyProgrammeName = studyProgrammeName;
    this.studyProgrammeIdentifier = studyProgrammeIdentifier;
    this.nationality = nationality;
    this.language = language;
    this.municipality = municipality;
    this.school = school;
    this.studyStartDate = studyStartDate;
    this.studyEndDate = studyEndDate;
    this.studyTimeEnd = studyTimeEnd;
    this.hidden = hidden;
    this.evaluationFees = evaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
    this.organizationIdentifier = organizationIdentifier;
  }

  @Override
  public String getSearchId() {
    return getIdentifier() + "/" + getSchoolDataSource();
  }

  @Override
  public String getIdentifier() {
    return identifier;
  }

  @Override
  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  @Override
  public String getFirstName() {
    return firstName;
  }

  @Override
  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  @Override
  public String getLastName() {
    return lastName;
  }
  
  @Override
  public String getSsn() {
    return ssn;
  }

  @Override
  public void setSsn(String ssn) {
    this.ssn = ssn;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }

  @Override
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  @Override
  public SchoolDataIdentifier getStudyProgrammeIdentifier() {
    return studyProgrammeIdentifier;
  }
  
  @Override
  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  @Override
  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  @Override
  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  @Override
  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  @Override
  public OffsetDateTime getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(OffsetDateTime studyStartDate) {
    this.studyStartDate = studyStartDate;
  }
  
  @Override
  public OffsetDateTime getStudyEndDate() {
    return this.studyEndDate;
  }
  
  public void setStudyEndDate(OffsetDateTime studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  @Override
  public OffsetDateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(OffsetDateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  @Override
  public boolean getHidden() {
    return hidden;
  }

  public void setHidden(boolean hidden) {
    this.hidden = hidden;
  }
  
  @Override
  public boolean getHasEvaluationFees() {
    return evaluationFees;
  }

  @Override
  public String getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(String curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  @Override
  public SchoolDataIdentifier getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  public void setOrganizationIdentifier(SchoolDataIdentifier organizationIdentifier) {
    this.organizationIdentifier = organizationIdentifier;
  }

  private String identifier;
  private String firstName;
  private String lastName;
  private String ssn;
  private String displayName;
  private String studyProgrammeName;
  private SchoolDataIdentifier studyProgrammeIdentifier;
  private String nationality;
  private String language;
  private String municipality;
  private String school;
  private OffsetDateTime studyStartDate;
  private OffsetDateTime studyEndDate;
  private OffsetDateTime studyTimeEnd;
  private boolean hidden;
  private boolean evaluationFees;
  private String curriculumIdentifier;
  private SchoolDataIdentifier organizationIdentifier;
  private String nickName;
}
