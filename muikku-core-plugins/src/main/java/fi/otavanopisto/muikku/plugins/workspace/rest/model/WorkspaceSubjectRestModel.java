package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;

public class WorkspaceSubjectRestModel {

  public WorkspaceSubjectRestModel() {
  }
  
  public WorkspaceSubjectRestModel(SchoolDataIdentifier identifier, SubjectRestModel subject, Double courseLength, WorkspaceLengthUnitRestModel courseLengthSymbol) {
    this.dataSource = identifier.getDataSource();
    this.identifier = identifier.getIdentifier();
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

  public String getDataSource() {
    return dataSource;
  }

  public void setDataSource(String dataSource) {
    this.dataSource = dataSource;
  }

  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  private String dataSource;
  private String identifier;
  private SubjectRestModel subject;
  private Double courseLength;
  private WorkspaceLengthUnitRestModel courseLengthSymbol;
}
