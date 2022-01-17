package fi.otavanopisto.muikku.plugins.workspace.rest.model;

public class WorkspaceSubjectRestModel {

  public WorkspaceSubjectRestModel() {
  }
  
  public WorkspaceSubjectRestModel(SubjectRestModel subject, Double courseLength, WorkspaceLengthUnitRestModel courseLengthSymbol) {
    this.subject = subject;
    this.courseLength = courseLength;
    this.courseLengthSymbol = courseLengthSymbol;
  }
  
  public SubjectRestModel getSubject() {
    return subject;
  }

  public void setSubject(SubjectRestModel subject) {
    this.subject = subject;
  }
  
  public Double getCourseLength() {
    return courseLength;
  }
  
  public void setCourseLength(Double courseLength) {
    this.courseLength = courseLength;
  }
  
  public WorkspaceLengthUnitRestModel getCourseLengthSymbol() {
    return courseLengthSymbol;
  }
  
  public void setCourseLengthSymbol(WorkspaceLengthUnitRestModel courseLengthSymbol) {
    this.courseLengthSymbol = courseLengthSymbol;
  }

  private SubjectRestModel subject;
  private Double courseLength;
  private WorkspaceLengthUnitRestModel courseLengthSymbol;
}
