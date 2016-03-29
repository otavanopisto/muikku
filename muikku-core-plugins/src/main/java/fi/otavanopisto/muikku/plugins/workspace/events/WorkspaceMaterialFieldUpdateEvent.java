package fi.otavanopisto.muikku.plugins.workspace.events;

import fi.otavanopisto.muikku.plugins.material.MaterialField;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceMaterialField;

public class WorkspaceMaterialFieldUpdateEvent extends WorkspaceMaterialFieldEvent {

  public WorkspaceMaterialFieldUpdateEvent(WorkspaceMaterialField workspaceMaterialField, MaterialField materialField, boolean removeAnswers) {
    super(workspaceMaterialField);
    this.materialField = materialField;
    this.removeAnswers = removeAnswers;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }
  
  public MaterialField getMaterialField() {
    return materialField;
  }

  public void setMaterialField(MaterialField materialField) {
    this.materialField = materialField;
  }

  private MaterialField materialField;
  private boolean removeAnswers;

}
