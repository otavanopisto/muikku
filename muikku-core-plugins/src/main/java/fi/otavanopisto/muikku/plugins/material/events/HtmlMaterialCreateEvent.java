package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialCreateEvent extends MaterialCreateEvent<HtmlMaterial> {

  public HtmlMaterialCreateEvent(HtmlMaterial material) {
    super(material);
  }
  
}
