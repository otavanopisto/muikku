package fi.otavanopisto.muikku.plugins.evaluation.rest.model;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.workspace.rest.model.WorkspaceSubjectRestModel;

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

  public Boolean getGraded() {
    return graded;
  }

  public void setGraded(Boolean graded) {
    this.graded = graded;
  }

  public List<WorkspaceSubjectRestModel> getSubjects() {
    return subjects;
  }

  public void setSubjects(List<WorkspaceSubjectRestModel> subjects) {
    this.subjects = subjects;
  }

  public boolean isInterimEvaluationRequest() {
    return isInterimEvaluationRequest;
  }

  public void setInterimEvaluationRequest(boolean isInterimEvaluationRequest) {
    this.isInterimEvaluationRequest = isInterimEvaluationRequest;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Boolean getHasPedagogyForm() {
    return hasPedagogyForm;
  }

  public void setHasPedagogyForm(Boolean hasPedagogyForm) {
    this.hasPedagogyForm = hasPedagogyForm;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public Date getSupplementationRequestDate() {
    return supplementationRequestDate;
  }

  public void setSupplementationRequestDate(Date supplementationRequestDate) {
    this.supplementationRequestDate = supplementationRequestDate;
  }

  private Long id;
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
  private boolean isInterimEvaluationRequest;
  private Date enrollmentDate;
  private Date assessmentRequestDate;
  private Date supplementationRequestDate;
  private Date evaluationDate;
  private Boolean graded;
  private Boolean passing;
  private Long assignmentsDone;
  private Long assignmentsTotal;
  private List<WorkspaceSubjectRestModel> subjects;
  private Boolean hasPedagogyForm;
  private String state; // essentially state string of WorkspaceAssessmentState

}
