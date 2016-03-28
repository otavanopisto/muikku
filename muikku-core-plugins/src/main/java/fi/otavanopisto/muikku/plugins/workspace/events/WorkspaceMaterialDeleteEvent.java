package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterial;

public class WorkspaceMaterialDeleteEvent extends WorkspaceMaterialEvent {

  public WorkspaceMaterialDeleteEvent(WorkspaceMaterial workspaceMaterial, Boolean removeAnswers) {
    super(workspaceMaterial);
    this.removeAnswers = removeAnswers;
  }
  
  public Boolean getRemoveAnswers() {
    return removeAnswers;
  }
  
  public void setRemoveAnswers(Boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }
  
  private Boolean removeAnswers;
  
}
