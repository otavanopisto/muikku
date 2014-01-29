package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialUpdateEvent extends MaterialUpdateEvent<HtmlMaterial> {

  public HtmlMaterialUpdateEvent(HtmlMaterial material) {
    super(material);
  }
  
}
