package fi.otavanopisto.muikku.plugins.hops.rest;

import java.time.OffsetDateTime;
import java.util.List;

public class StudentInformationRestModel {
  
  public StudentInformationRestModel(
      Long id,
      String firstName,
      String lastName,
      String studyProgrammeEducationType,
      OffsetDateTime studyTimeEnd,
      List<String> counselorList) {
    super();
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.studyProgrammeEducationType = studyProgrammeEducationType;
    this.studyTimeEnd = studyTimeEnd;
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

  public String getStudyProgrammeEducationType() {
    return studyProgrammeEducationType;
  }

  public void setStudyProgrammeEducationType(String studyProgrammeEducationType) {
    this.studyProgrammeEducationType = studyProgrammeEducationType;
  }

  public OffsetDateTime getStudyTimeEnd() {
    return studyTimeEnd;
  }

  public void setStudyTimeEnd(OffsetDateTime studyTimeEnd) {
    this.studyTimeEnd = studyTimeEnd;
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
  private String studyProgrammeEducationType;
  private OffsetDateTime studyTimeEnd;
  private List<String> counselorList;
}
