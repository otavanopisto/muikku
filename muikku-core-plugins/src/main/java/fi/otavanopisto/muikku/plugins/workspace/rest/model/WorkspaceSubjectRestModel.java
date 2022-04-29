package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceSubjectRestModel {

  public WorkspaceSubjectRestModel() {
  }
  
  public WorkspaceSubjectRestModel(SchoolDataIdentifier identifier, SubjectRestModel subject, Integer courseNumber, Double courseLength, WorkspaceLengthUnitRestModel courseLengthSymbol) {
    this.identifier = identifier.toId();
    this.subject = subject;
    this.courseNumber = courseNumber;
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

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Integer getCourseNumber() {
    return courseNumber;
  }

  public void setCourseNumber(Integer courseNumber) {
    this.courseNumber = courseNumber;
  }

  private String identifier;
  private SubjectRestModel subject;
  private Integer courseNumber;
  private Double courseLength;
  private WorkspaceLengthUnitRestModel courseLengthSymbol;
}
