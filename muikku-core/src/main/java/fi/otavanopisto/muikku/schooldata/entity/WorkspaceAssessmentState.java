package fi.otavanopisto.muikku.schooldata.entity;

import java.util.Date;

public class WorkspaceAssessmentState {

  public static final String UNASSESSED = "unassessed";                                   // no request, no grade
  public static final String PENDING = "pending";                                         // active request, no grade
  public static final String PENDING_PASS = "pending_pass";                               // active request, earlier passing grade
  public static final String PENDING_FAIL = "pending_fail";                               // active request, earlier failing grade
  public static final String PASS = "pass";                                               // no request, passing grade
  public static final String FAIL = "fail";                                               // no request, failing grade
  public static final String INCOMPLETE = "incomplete";                                   // teacher has requested changes
  public static final String INTERIM_EVALUATION_REQUEST = "interim_evaluation_request";   // interim evaluation request
  public static final String INTERIM_EVALUATION = "interim_evaluation";                   // interim evaluation
  public static final String TRANSFERRED = "transferred";                                 // transfer credit

  public String getState() {
    return state;
  }

  public Date getDate() {
    return date;
  }

  public void setState(String state) {
    this.state = state;
  }

  public void setDate(Date date) {
    this.date = date;
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

  public Date getGradeDate() {
    return gradeDate;
  }

  public void setGradeDate(Date gradeDate) {
    this.gradeDate = gradeDate;
  }

  public Boolean isPassingGrade() {
    return passingGrade;
  }

  public void setPassingGrade(Boolean passingGrade) {
    this.passingGrade = passingGrade;
  }

  public WorkspaceActivitySubject getSubject() {
    return subject;
  }

  public void setSubject(WorkspaceActivitySubject subject) {
    this.subject = subject;
  }

  private Date date;
  private String state;
  private String grade;
  private Boolean passingGrade;
  private Date gradeDate;
  private String text;
  private WorkspaceActivitySubject subject;
  
}