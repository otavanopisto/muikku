package fi.otavanopisto.muikku.plugins.communicator.rest;

public class CommunicatorUserBasicInfo {

  public CommunicatorUserBasicInfo() {
  }

  public CommunicatorUserBasicInfo(Long id,
              String firstName,
              String lastName,
              String nickName, 
              boolean archived,
              boolean hasImage 
              ) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.archived = archived;
    this.hasImage = hasImage;
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
  
  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }
  
  public boolean isArchived() {
    return archived;
  }
  
  public void setArchived(boolean archived) {
    this.archived = archived;
  }

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean archived;
  private boolean hasImage;
}
