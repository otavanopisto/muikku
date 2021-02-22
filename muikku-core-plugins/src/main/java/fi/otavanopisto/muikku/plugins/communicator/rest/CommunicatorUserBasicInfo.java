package fi.otavanopisto.muikku.plugins.communicator.rest;

public class CommunicatorUserBasicInfo {

  public CommunicatorUserBasicInfo() {
  }

  public CommunicatorUserBasicInfo(
              Long id,
              String firstName,
              String lastName,
              String nickName, 
              boolean archived,
              boolean studiesEnded 
              ) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.archived = archived;
    this.studiesEnded = studiesEnded;
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

  private Long id;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean archived;
  private boolean studiesEnded;
}
