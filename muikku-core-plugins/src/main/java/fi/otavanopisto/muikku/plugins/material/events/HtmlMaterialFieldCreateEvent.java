package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.model.material.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.MaterialField;

public class HtmlMaterialFieldCreateEvent {

  public HtmlMaterialFieldCreateEvent(HtmlMaterial material, MaterialField field) {
    super();
    this.material = material;
    this.field = field;
  }
  
  public HtmlMaterial getMaterial() {
    return material;
  }

  public MaterialField getField() {
    return field;
  }
  
  private HtmlMaterial material;
  private MaterialField field;
}
