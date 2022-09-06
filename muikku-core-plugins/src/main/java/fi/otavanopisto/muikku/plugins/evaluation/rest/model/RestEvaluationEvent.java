package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestEvaluationEvent {
  
  public RestEvaluationEvent() {
  }
  
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getAuthor() {
    return author;
  }

  public void setAuthor(String author) {
    this.author = author;
  }

  public String getGrade() {
    return grade;
  }

  public void setGrade(String grade) {
    this.grade = grade;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public RestEvaluationEventType getType() {
    return type;
  }

  public void setType(RestEvaluationEventType type) {
    this.type = type;
  }

  public String getStudent() {
    return student;
  }

  public void setStudent(String student) {
    this.student = student;
  }

  public String getGradeIdentifier() {
    return gradeIdentifier;
  }

  public void setGradeIdentifier(String gradeIdentifier) {
    this.gradeIdentifier = gradeIdentifier;
  }

  public String getWorkspaceSubjectIdentifier() {
    return workspaceSubjectIdentifier;
  }

  public void setWorkspaceSubjectIdentifier(String workspaceSubjectIdentifier) {
    this.workspaceSubjectIdentifier = workspaceSubjectIdentifier;
  }

  private String identifier;
  private String workspaceSubjectIdentifier;
  private Date date;
  private String student;
  private String author;
  private String grade;
  private String gradeIdentifier;
  private String text;
  private RestEvaluationEventType type;

}
