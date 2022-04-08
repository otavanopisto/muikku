package fi.otavanopisto.muikku.plugins.hops.rest;

import java.time.OffsetDateTime;
import java.util.List;

public class StudentInformationRestModel {
  
  public StudentInformationRestModel(
      Long id,
      String firstName,
      String lastName,
      String educationalLevel,
      OffsetDateTime studyEndDate,
      List<String> counselorList) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.educationalLevel=educationalLevel;
    this.studyEndDate = studyEndDate;
    this.counselorList = counselorList;
    
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

  public String getEducationalLevel() {
    return educationalLevel;
  }

  public void setEducationalLevel(String educationalLevel) {
    this.educationalLevel = educationalLevel;
  }

  public OffsetDateTime getStudyEndDate() {
    return studyEndDate;
  }

  public void setStudyEndDate(OffsetDateTime studyEndDate) {
    this.studyEndDate = studyEndDate;
  }

  public List<String> getCounselorList() {
    return counselorList;
  }

  public void setCounselorList(List<String> counselorList) {
    this.counselorList = counselorList;
  }
  
  private Long id;
  private String firstName;
  private String lastName;
  private String educationalLevel;
  private OffsetDateTime studyEndDate;
  private List<String> counselorList;
}
