package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.Date;
import java.util.List;

import fi.otavanopisto.muikku.plugins.evaluation.rest.model.RestAssignmentEvaluation;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceCompositeReply {

  public WorkspaceCompositeReply(){
  }
  
  public WorkspaceCompositeReply(Long workspaceMaterialId, Long workspaceMaterialReplyId, WorkspaceMaterialReplyState state, Date submitted, List<WorkspaceMaterialFieldAnswer> answers) {
    this.workspaceMaterialId = workspaceMaterialId;
    this.workspaceMaterialReplyId = workspaceMaterialReplyId;
    this.state = state;
    this.answers = answers;
    this.submitted = submitted;
  }
  
  public Long getWorkspaceMaterialId() {
    return workspaceMaterialId;
  }
  
  public void setWorkspaceMaterialId(Long workspaceMaterialId) {
    this.workspaceMaterialId = workspaceMaterialId;
  }
  
  public Long getWorkspaceMaterialReplyId() {
    return workspaceMaterialReplyId;
  }
  
  public void setWorkspaceMaterialReplyId(Long workspaceMaterialReplyId) {
    this.workspaceMaterialReplyId = workspaceMaterialReplyId;
  }
  
  public WorkspaceMaterialReplyState getState() {
    return state;
  }
  
  public void setState(WorkspaceMaterialReplyState state) {
    this.state = state;
  }

  public List<WorkspaceMaterialFieldAnswer> getAnswers() {
    return answers;
  }
  
  public RestAssignmentEvaluation getEvaluationInfo() {
    return evaluationInfo;
  }

  public void setEvaluationInfo(RestAssignmentEvaluation evaluationInfo) {
    this.evaluationInfo = evaluationInfo;
  }

  public Date getSubmitted() {
    return submitted;
  }

  public void setSubmitted(Date submitted) {
    this.submitted = submitted;
  }

  public RestAssignmentEvaluation getSupplementationRequestInfo() {
    return supplementationRequestInfo;
  }

  public void setSupplementationRequestInfo(RestAssignmentEvaluation supplementationRequestInfo) {
    this.supplementationRequestInfo = supplementationRequestInfo;
  }

  private Long workspaceMaterialId;
  private Long workspaceMaterialReplyId;
  private WorkspaceMaterialReplyState state;
  private List<WorkspaceMaterialFieldAnswer> answers;
  private RestAssignmentEvaluation evaluationInfo;
  private RestAssignmentEvaluation supplementationRequestInfo;
  private Date submitted;

}