package fi.otavanopisto.muikku.plugins.transcriptofrecords.rest;

public class VopsPlannedCourseRESTModel {
  public VopsPlannedCourseRESTModel() {
    
  }
  public VopsPlannedCourseRESTModel(
      String subjectIdentifier,
      int courseNumber,
      String studentIdentifier
  ) {
    this.subjectIdentifier = subjectIdentifier;
    this.courseNumber = courseNumber;
    this.studentIdentifier = studentIdentifier;
  }
  
  public String getSubjectIdentifier() {
    return subjectIdentifier;
  }
  public void setSubjectIdentifier(String subjectIdentifier) {
    this.subjectIdentifier = subjectIdentifier;
  }
  public int getCourseNumber() {
    return courseNumber;
  }
  public void setCourseNumber(int courseNumber) {
    this.courseNumber = courseNumber;
  }
  public String getStudentIdentifier() {
    return studentIdentifier;
  }
  public void setStudentIdentifier(String studentIdentifier) {
    this.studentIdentifier = studentIdentifier;
  }
  
  private String subjectIdentifier;
  private int courseNumber;
  private String studentIdentifier;
}
