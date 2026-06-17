package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.model.material.HtmlMaterial;

public class HtmlMaterialCreateEvent extends MaterialCreateEvent<HtmlMaterial> {

  public HtmlMaterialCreateEvent(HtmlMaterial material) {
    super(material);
  }
  
}
