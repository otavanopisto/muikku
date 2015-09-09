package fi.muikku.plugins.workspace.rest.model;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialReply {

  public WorkspaceMaterialReply(){
  }
  
  public WorkspaceMaterialReply(Long id, WorkspaceMaterialReplyState state) {
    this.id = id;
    this.state = state;
  }
  
  public Long getId() {
    return id;
  }
  
  public void setId(Long id) {
    this.id = id;
  }
  
  public WorkspaceMaterialReplyState getState() {
    return state;
  }
  
  public void setState(WorkspaceMaterialReplyState state) {
    this.state = state;
  }

  private Long id;
  private WorkspaceMaterialReplyState state;
}
