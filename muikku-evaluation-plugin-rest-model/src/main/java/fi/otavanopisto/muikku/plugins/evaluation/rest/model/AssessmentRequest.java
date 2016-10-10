package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class AssessmentRequest {

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

  public String getStudyProgramme() {
    return studyProgramme;
  }

  public void setStudyProgramme(String studyProgramme) {
    this.studyProgramme = studyProgramme;
  }

  public String getWorkspaceName() {
    return workspaceName;
  }

  public void setWorkspaceName(String workspaceName) {
    this.workspaceName = workspaceName;
  }

  public String getWorkspaceNameExtension() {
    return workspaceNameExtension;
  }

  public void setWorkspaceNameExtension(String workspaceNameExtension) {
    this.workspaceNameExtension = workspaceNameExtension;
  }

  public Date getEnrollmentDate() {
    return enrollmentDate;
  }

  public void setEnrollmentDate(Date enrollmentDate) {
    this.enrollmentDate = enrollmentDate;
  }

  public Date getAssessmentRequestDate() {
    return assessmentRequestDate;
  }

  public void setAssessmentRequestDate(Date assessmentRequestDate) {
    this.assessmentRequestDate = assessmentRequestDate;
  }

  public Long getAssignmentsDone() {
    return assignmentsDone;
  }

  public void setAssignmentsDone(Long assignmentsDone) {
    this.assignmentsDone = assignmentsDone;
  }

  public Long getAssignmentsTotal() {
    return assignmentsTotal;
  }

  public void setAssignmentsTotal(Long assignmentsTotal) {
    this.assignmentsTotal = assignmentsTotal;
  }

  private String firstName;
  private String lastName;
  private String studyProgramme;
  private String workspaceName;
  private String workspaceNameExtension;
  private Date enrollmentDate;
  private Date assessmentRequestDate;
  private Long assignmentsDone;
  private Long assignmentsTotal;

}
