package fi.otavanopisto.muikku.rest.model;

import java.util.Date;

public class User {

  public User() {
  }

  public User(Long id,
              String firstName,
              String lastName,
              String nickName,
              String studyProgrammeName,
              boolean hasImage,
              String email,
              Date studyStartDate,
              Date studyTimeEnd
              ) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.studyProgrammeName = studyProgrammeName;
    this.hasImage = hasImage;
    this.email = email;
    this.studyStartDate = studyStartDate;
    this.studyTimeEnd = studyTimeEnd;
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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Date getStudyStartDate() {
    return studyStartDate;
  }

  public void setStudyStartDate(Date studyStartDate) {
    this.studyStartDate = studyStartDate;
  }

  public Date getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(Date studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
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

  private Long id;
  private String firstName;
  private String lastName;
  private String nickName;
  private String studyProgrammeName;
  private boolean hasImage;
  private String email;
  private Date studyStartDate;
  private Date studyTimeEnd;
}
