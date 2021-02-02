package fi.otavanopisto.muikku.plugins.communicator.rest;

/**
 * REST model for message recipient in search.
 */
public class CommunicatorSearchResultRecipientRESTModel {

  public CommunicatorSearchResultRecipientRESTModel() {
  }
  
  public CommunicatorSearchResultRecipientRESTModel(Long userEntityId, String firstName, String lastName, String nickName, String studyProgrammeName) {
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
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
  
  public void getStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  private Long userEntityId;

  private String firstName;
  
  private String lastName;
  
  private String nickName;
  
  private String studyProgrammeName;
}
