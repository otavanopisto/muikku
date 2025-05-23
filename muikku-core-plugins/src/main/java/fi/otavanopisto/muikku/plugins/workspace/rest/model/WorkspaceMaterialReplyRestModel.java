package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialReplyRestModel {

  public WorkspaceMaterialReplyRestModel() {
  }
  
  public WorkspaceMaterialReplyRestModel(Long id, WorkspaceMaterialReplyState state) {
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
