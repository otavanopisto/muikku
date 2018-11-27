package fi.otavanopisto.muikku.plugins.forum.rest;

public class ForumMessageUserRESTModel {

  public ForumMessageUserRESTModel() {
  }
  
  public ForumMessageUserRESTModel(Long id, String firstName, String lastName, String nickName, boolean hasImage) {
    this.id = id;
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

  public String getNickName() {
    return nickName;
  }

  public void setNickName(String nickName) {
    this.nickName = nickName;
  }

  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }

  private Long id;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean hasImage;
}
