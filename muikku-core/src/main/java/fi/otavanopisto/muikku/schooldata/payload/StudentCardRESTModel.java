package fi.otavanopisto.muikku.schooldata.payload;

import java.util.Date;

public class StudentCardRESTModel {
  
  public StudentCardRESTModel() {
    
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

  public String getStudyProgramme() {
    return studyProgramme;
  }

  public void setStudyProgramme(String studyProgramme) {
    this.studyProgramme = studyProgramme;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getExpiryDate() {
    return expiryDate;
  }

  public void setExpiryDate(Date expiryDate) {
    this.expiryDate = expiryDate;
  }

  public String getActivity() {
    return activity;
  }

  public void setActivity(String activity) {
    this.activity = activity;
  }

  public StudentCardType getType() {
    return type;
  }

  public void setType(StudentCardType type) {
    this.type = type;
  }

  private Long id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String studyProgramme;
  private Date expiryDate;
  private String activity;
  private StudentCardType type;
}
