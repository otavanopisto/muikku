package fi.muikku.rest.model;

public class UserBasicInfo {

  public UserBasicInfo() {
  }

  public UserBasicInfo(Long id,
              String firstName,
              String lastName, 
              boolean hasImage) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
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

  private Long id;
  private String firstName;
  private String lastName;
  private boolean hasImage;
}
