package fi.otavanopisto.muikku.plugins.hops.rest;

public class StudyHoursRestModel {

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
  
  public Integer getStudyHours() {
    return hours;
  }

  public void setStudyHours(Integer hours) {
    this.hours = hours;
  }
  
  public String getStudentIdentifier() {
    return studentIdentifier;
  }

  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }

  private Long id;
  private Integer hours;
  private String studentIdentifier;

}
