package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialCreateEvent extends MaterialCreateEvent<BinaryMaterial> {

  public BinaryMaterialCreateEvent(BinaryMaterial material) {
    super(material);
  }
  
}
