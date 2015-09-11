package fi.muikku.plugins.workspace.rest.model;

import java.util.List;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceCompositeReply {

  public WorkspaceCompositeReply(){
  }
  
  public WorkspaceCompositeReply(Long workspaceMaterialId, WorkspaceMaterialReplyState state, List<WorkspaceMaterialFieldAnswer> answers) {
    this.workspaceMaterialId = workspaceMaterialId;
    this.state = state;
    this.answers = answers;
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
  
  private Long workspaceMaterialId;
  private Long workspaceMaterialReplyId;
  private WorkspaceMaterialReplyState state;
  private List<WorkspaceMaterialFieldAnswer> answers;
}