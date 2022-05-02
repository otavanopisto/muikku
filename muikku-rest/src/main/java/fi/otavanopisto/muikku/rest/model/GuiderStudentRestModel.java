package fi.otavanopisto.muikku.rest.model;

import java.util.Date;
import java.util.List;

public class GuiderStudentRestModel extends Student {

  public GuiderStudentRestModel() {
  }

  public GuiderStudentRestModel(String id, String firstName, String lastName, String nickName, String studyProgrammeName,
      String studyProgrammeIdentifier, Boolean hasImage, String nationality, String language, String municipality,
      String school, String email, Date studyStartDate, Date studyEndDate, Date studyTimeEnd, Date lastLogin,
      String curriculumIdentifier, boolean updatedByStudent, Long userEntityId, List<StudentFlag> flags,
      OrganizationRESTModel organization, boolean isUpperSecondarySchoolCurriculum) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgrammeName = studyProgrammeName;
    this.studyProgrammeIdentifier = studyProgrammeIdentifier;
    this.hasImage = hasImage;
    this.nationality = nationality;
    this.language = language;
    this.municipality = municipality;
    this.school = school;
    this.email = email;
    this.studyStartDate = studyStartDate;
    this.studyEndDate = studyEndDate;
    this.studyTimeEnd = studyTimeEnd;
    this.lastLogin = lastLogin;
    this.curriculumIdentifier = curriculumIdentifier;
    this.updatedByStudent = updatedByStudent;
    this.userEntityId = userEntityId;
    this.setFlags(flags);
    this.organization = organization;
    this.isUpperSecondarySchoolCurriculum = isUpperSecondarySchoolCurriculum;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
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

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public Boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(Boolean hasImage) {
    this.hasImage = hasImage;
  }

  public String getNationality() {
    return nationality;
  }

  public void setNationality(String nationality) {
    this.nationality = nationality;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getMunicipality() {
    return municipality;
  }

  public void setMunicipality(String municipality) {
    this.municipality = municipality;
  }

  public String getSchool() {
    return school;
  }

  public void setSchool(String school) {
    this.school = school;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Date getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(Date studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public Date getStudyEndDate() {
    return studyEndDate;
  }

  public void setStudyEndDate(Date studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  public Date getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(Date studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  public String getCurriculumIdentifier() {
    return curriculumIdentifier;
  }

  public void setCurriculumIdentifier(String curriculumIdentifier) {
    this.curriculumIdentifier = curriculumIdentifier;
  }

  public boolean isUpdatedByStudent() {
    return updatedByStudent;
  }

  public void setUpdatedByStudent(boolean updatedByStudent) {
    this.updatedByStudent = updatedByStudent;
  }

  public List<StudentFlag> getFlags() {
    return flags;
  }

  public void setFlags(List<StudentFlag> flags) {
    this.flags = flags;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public OrganizationRESTModel getOrganization() {
    return organization;
  }

  public void setOrganization(OrganizationRESTModel organization) {
    this.organization = organization;
  }

  public String getStudyProgrammeIdentifier() {
    return studyProgrammeIdentifier;
  }

  public void setStudyProgrammeIdentifier(String studyProgrammeIdentifier) {
    this.studyProgrammeIdentifier = studyProgrammeIdentifier;
  }

  public Date getLastLogin() {
    return lastLogin;
  }

  public void setLastLogin(Date lastLogin) {
    this.lastLogin = lastLogin;
  }

  public boolean getIsUpperSecondarySchoolCurriculum() {
    return isUpperSecondarySchoolCurriculum;
  }

  public void setIsUpperSecondarySchoolCurriculum(boolean isUpperSecondarySchoolCurriculum) {
    this.isUpperSecondarySchoolCurriculum = isUpperSecondarySchoolCurriculum;
  }

  private String id;
  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgrammeName;
  private String studyProgrammeIdentifier;
  private Boolean hasImage;
  private String nationality;
  private String language;
  private String municipality;
  private String school;
  private String email;
  private Date studyStartDate;
  private Date studyEndDate;
  private Date studyTimeEnd;
  private Date lastLogin;
  private String curriculumIdentifier;
  private boolean updatedByStudent;
  private Long userEntityId;
  private List<StudentFlag> flags;
  private OrganizationRESTModel organization;
  private boolean isUpperSecondarySchoolCurriculum;
}
