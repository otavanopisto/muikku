package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.MaterialField;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialFieldCreated {

  public HtmlMaterialFieldCreated(HtmlMaterial material, MaterialField field) {
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
