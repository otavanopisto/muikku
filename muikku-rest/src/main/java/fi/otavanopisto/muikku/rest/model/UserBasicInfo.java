package fi.otavanopisto.muikku.rest.model;

public class UserBasicInfo {

  public UserBasicInfo() {
  }

  public UserBasicInfo(Long id,
              String firstName,
              String lastName, 
              String studyProgrammeName,
              boolean hasImage, 
              boolean hasEvaluationFees,
              String curriculumIdentifier) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgrammeName = studyProgrammeName;
    this.hasImage = hasImage;
    this.hasEvaluationFees = hasEvaluationFees;
    this.curriculumIdentifier = curriculumIdentifier;
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

  private Long id;
  private String firstName;
  private String lastName;
  private String studyProgrammeName;
  private boolean hasImage;
  private boolean hasEvaluationFees;
  private String curriculumIdentifier;
}
