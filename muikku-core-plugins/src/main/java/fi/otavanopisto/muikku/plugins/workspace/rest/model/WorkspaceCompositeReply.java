package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import java.util.ArrayList;
import java.util.Comparator;
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
  
  public Date getSubmitted() {
    return submitted;
  }

  public void setSubmitted(Date submitted) {
    this.submitted = submitted;
  }

  public void addEvaluation(RestAssignmentEvaluation evaluation) {
    evaluations.add(evaluation);
    sortEvaluations();
  }
  
  public List<RestAssignmentEvaluation> getEvaluations() {
    return evaluations;
  }

  public void setEvaluations(List<RestAssignmentEvaluation> evaluations) {
    this.evaluations = evaluations;
    sortEvaluations();
  }

  private void sortEvaluations() {
    if (this.evaluations != null) {
      this.evaluations.sort(Comparator.comparing(RestAssignmentEvaluation::getDate).reversed());
    }
  }

  private Long workspaceMaterialId;
  private Long workspaceMaterialReplyId;
  private WorkspaceMaterialReplyState state;
  private List<WorkspaceMaterialFieldAnswer> answers;
  private List<RestAssignmentEvaluation> evaluations = new ArrayList<>();
  private Date submitted;

}