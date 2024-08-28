package fi.otavanopisto.muikku.plugins.me;

import java.time.LocalDate;
import java.util.Date;

public class GuardiansDependentRestModel {

  public GuardiansDependentRestModel(Long userEntityId, String identifier, String firstName, String lastName, String nickName,
      String studyProgrammeName, boolean hasImage, String email, String phoneNumber, String address, Date latestLogin, 
      LocalDate studyStartDate, LocalDate studyTimeEnd, LocalDate studyEndDate) {
    super();
    this.userEntityId = userEntityId;
    this.identifier = identifier;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgrammeName = studyProgrammeName;
    this.hasImage = hasImage;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.address = address;
    this.latestLogin = latestLogin;
    this.studyStartDate = studyStartDate;
    this.studyTimeEnd = studyTimeEnd;
    this.studyEndDate = studyEndDate;
  }

  public String getIdentifier() {
    return identifier;
  }
  
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
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

  public void setStudyProgrammeName(String studyProgrammeName) {
    this.studyProgrammeName = studyProgrammeName;
  }

  public boolean isHasImage() {
    return hasImage;
  }

  public void setHasImage(boolean hasImage) {
    this.hasImage = hasImage;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Date getLatestLogin() {
    return latestLogin;
  }

  public void setLatestLogin(Date latestLogin) {
    this.latestLogin = latestLogin;
  }

  public LocalDate getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(LocalDate studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public LocalDate getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(LocalDate studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
  }

  public LocalDate getStudyEndDate() {
    return studyEndDate;
  }

  public void setStudyEndDate(LocalDate studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  private Long userEntityId;
  private String identifier;
  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgrammeName;
  private boolean hasImage;
  private String email;
  private String phoneNumber;
  private String address;
  private Date latestLogin;
  private LocalDate studyStartDate;
  private LocalDate studyTimeEnd;
  private LocalDate studyEndDate;

}
