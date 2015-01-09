package fi.muikku.plugins.workspace.events;

import fi.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class WorkspaceMaterialFieldUpdateEvent extends WorkspaceMaterialFieldEvent {

  public WorkspaceMaterialFieldUpdateEvent(WorkspaceMaterialField workspaceMaterialField, boolean removeAnswers) {
    super(workspaceMaterialField);
    this.removeAnswers = removeAnswers;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }
  
  private boolean removeAnswers;

}
