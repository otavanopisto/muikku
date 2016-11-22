package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;

public class RestAssessmentRequest {
  
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

  public String getWorkspaceUrlName() {
    return workspaceUrlName;
  }

  public void setWorkspaceUrlName(String workspaceUrlName) {
    this.workspaceUrlName = workspaceUrlName;
  }

  public Long getWorkspaceEntityId() {
    return workspaceEntityId;
  }

  public void setWorkspaceEntityId(Long workspaceEntityId) {
    this.workspaceEntityId = workspaceEntityId;
  }

  public Date getEvaluationDate() {
    return evaluationDate;
  }

  public void setEvaluationDate(Date evaluationDate) {
    this.evaluationDate = evaluationDate;
  }

  public Boolean getPassing() {
    return passing;
  }

  public void setPassing(Boolean passing) {
    this.passing = passing;
  }

  public Long getUserEntityId() {
    return userEntityId;
  }

  public void setUserEntityId(Long userEntityId) {
    this.userEntityId = userEntityId;
  }

  public Long getWorkspaceUserEntityId() {
    return workspaceUserEntityId;
  }

  public void setWorkspaceUserEntityId(Long workspaceUserEntityId) {
    this.workspaceUserEntityId = workspaceUserEntityId;
  }

  public String getWorkspaceUserIdentifier() {
    return workspaceUserIdentifier;
  }

  public void setWorkspaceUserIdentifier(String workspaceUserIdentifier) {
    this.workspaceUserIdentifier = workspaceUserIdentifier;
  }

  private Long userEntityId;
  private String firstName;
  private String lastName;
  private String studyProgramme;
  private Long workspaceEntityId;
  private Long workspaceUserEntityId;
  private String workspaceUserIdentifier;
  private String workspaceName;
  private String workspaceNameExtension;
  private String workspaceUrlName;
  private Date enrollmentDate;
  private Date assessmentRequestDate;
  private Date evaluationDate;
  private Boolean passing;
  private Long assignmentsDone;
  private Long assignmentsTotal;

}
