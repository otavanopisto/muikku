package fi.otavanopisto.muikku.rest.model;

public class UserBasicInfo {

  public UserBasicInfo() {
  }

  public UserBasicInfo(Long id,
              String identifier,
              String firstName,
              String lastName,
              String nickName, 
              boolean hasImage 
              ) {
    super();
    this.id = id;
    this.setIdentifier(identifier);
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
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

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  private Long id;
  private String identifier;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean hasImage;
}
