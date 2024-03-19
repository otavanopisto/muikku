package fi.otavanopisto.muikku.plugins.schooldatapyramus.entities;

import java.util.Date;

import fi.otavanopisto.muikku.schooldata.entity.StudentCard;

public class PyramusStudentCard implements StudentCard{
  
  
  public PyramusStudentCard(Long id, Long userEntityId, String firstName, String lastName, String studyProgramme,
      Date expiryDate, Boolean active, String type) {
    super();
    this.id = id;
    this.userEntityId = userEntityId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgramme = studyProgramme;
    this.expiryDate = expiryDate;
    this.active = active;
    this.type = type;
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

  public Date getExpiryDate() {
    return expiryDate;
  }

  public void setExpiryDate(Date expiryDate) {
    this.expiryDate = expiryDate;
  }

  public Boolean getActive() {
    return active;
  }

  public void setActive(Boolean active) {
    this.active = active;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  private Long id;
  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String studyProgramme;
  private Date expiryDate;
  private Boolean active;
  private String type;
}
