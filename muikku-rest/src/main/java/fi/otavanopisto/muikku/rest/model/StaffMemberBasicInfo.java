package fi.otavanopisto.muikku.rest.model;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class StaffMemberBasicInfo {

  public StaffMemberBasicInfo() {
  }

  public StaffMemberBasicInfo(
      Long userEntityId,
      SchoolDataIdentifier userIdentifier,
      String firstName,
      String lastName,
      String nickName, 
      boolean hasImage) {
    super();
    this.userEntityId = userEntityId;
    this.userIdentifier = userIdentifier.toId();
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.hasImage = hasImage;
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

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public String getUserIdentifier() {
    return userIdentifier;
  }

  public void setUserIdentifier(String userIdentifier) {
    this.userIdentifier = userIdentifier;
  }

  private Long userEntityId;
  private String userIdentifier;
  private String firstName;
  private String lastName;
  private String nickName;
  private boolean hasImage;
}
