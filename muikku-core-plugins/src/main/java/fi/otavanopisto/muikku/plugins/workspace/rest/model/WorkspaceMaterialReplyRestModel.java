package fi.otavanopisto.muikku.plugins.workspace.rest.model;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialReplyState;

public class WorkspaceMaterialReplyRestModel {

  public WorkspaceMaterialReplyRestModel() {
  }
  
  public WorkspaceMaterialReplyRestModel(Long id, WorkspaceMaterialReplyState state, boolean locked) {
    this.id = id;
    this.state = state;
    this.locked = locked;
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

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  private Long id;
  private WorkspaceMaterialReplyState state;
  private boolean locked;

}
