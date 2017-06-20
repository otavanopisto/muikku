package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class VopsPlannedCourseRESTModel {
  public VopsPlannedCourseRESTModel() {
    
  }
  
  public String getSubjectIdentifier() {
    return subjectIdentifier;
  }
  public void setSubjectIdentifier(String subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }
  public long getCourseNumber() {
    return courseNumber;
  }
  public void setCourseNumber(long courseNumber) {
    this.courseNumber = courseNumber;
  }
  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }
  
  private String subjectIdentifier;
  private long courseNumber;
  private String studentIdentifier;
}
