package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialDeleteEvent extends MaterialDeleteEvent<HtmlMaterial> {

  public HtmlMaterialDeleteEvent(HtmlMaterial material) {
    super(material);
  }
  
}
