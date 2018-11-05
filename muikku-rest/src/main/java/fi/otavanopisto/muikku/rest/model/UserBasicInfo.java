package fi.otavanopisto.muikku.rest.model;

public class UserBasicInfo {

  public UserBasicInfo() {
  }

  public UserBasicInfo(Long id,
              String firstName,
              String lastName,
              String nickName, 
              String studyProgrammeName,
              boolean hasImage, 
              boolean hasEvaluationFees,
              String curriculumIdentifier,
              String organizationIdentifier) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgrammeName = studyProgrammeName;
    this.hasImage = hasImage;
    this.hasEvaluationFees = hasEvaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
    this.organizationIdentifier = organizationIdentifier;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
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
  
  public String getStudyProgrammeName() {
    return studyProgrammeName;
  }
  
  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
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

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public String getOrganizationIdentifier() {
    return organizationIdentifier;
  }

  public void setOrganizationIdentifier(String organizationIdentifier) {
    this.organizationIdentifier = organizationIdentifier;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgrammeName;
  private boolean hasImage;
  private boolean hasEvaluationFees;
  private String curriculumIdentifier;
  private String organizationIdentifier;
}
