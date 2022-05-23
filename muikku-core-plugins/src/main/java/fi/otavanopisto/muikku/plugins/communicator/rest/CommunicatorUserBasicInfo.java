package fi.otavanopisto.muikku.plugins.communicator.rest;

public class CommunicatorUserBasicInfo {

  public CommunicatorUserBasicInfo() {
  }

  public CommunicatorUserBasicInfo(
              Long userEntityId,
              String firstName,
              String lastName,
              String nickName,
              String studyProgramme,
              boolean archived,
              boolean studiesEnded 
              ) {
    super();
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgramme = studyProgramme;
    this.archived = archived;
    this.studiesEnded = studiesEnded;
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

  public boolean isStudiesEnded() {
    return studiesEnded;
  }

  public void setStudiesEnded(boolean studiesEnded) {
    this.studiesEnded = studiesEnded;
  }
  
  public boolean isArchived() {
    return archived;
  }
  
  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getStudyProgramme() {
    return studyProgramme;
  }

  public void setStudyProgramme(String studyProgramme) {
    this.studyProgramme = studyProgramme;
  }

  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgramme;
  private boolean archived;
  private boolean studiesEnded;
}
