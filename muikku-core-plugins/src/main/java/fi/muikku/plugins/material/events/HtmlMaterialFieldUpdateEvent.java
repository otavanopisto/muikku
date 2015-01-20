package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.MaterialField;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialFieldUpdateEvent {

  public HtmlMaterialFieldUpdateEvent(HtmlMaterial material, MaterialField field, boolean removeAnswers) {
    super();
    this.material = material;
    this.field = field;
    this.removeAnswers = removeAnswers;
  }
  
  public HtmlMaterial getMaterial() {
    return material;
  }

  public MaterialField getField() {
    return field;
  }
  
  public boolean getRemoveAnswers() {
    return removeAnswers;
  }

  public void setRemoveAnswers(boolean removeAnswers) {
    this.removeAnswers = removeAnswers;
  }

  private HtmlMaterial material;
  private MaterialField field;
  private boolean removeAnswers;
}
