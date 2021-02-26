package fi.otavanopisto.muikku.plugins.communicator.rest;

/**
 * REST model for message recipient in search.
 */
@Deprecated
public class CommunicatorSearchSenderRESTModel {

  public CommunicatorSearchSenderRESTModel() {
  }
  
  public CommunicatorSearchSenderRESTModel(Long userEntityId, String firstName, String lastName, String nickName) {
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

  private Long userEntityId;

  private String firstName;
  
  private String lastName;
  
  private String nickName;
}
