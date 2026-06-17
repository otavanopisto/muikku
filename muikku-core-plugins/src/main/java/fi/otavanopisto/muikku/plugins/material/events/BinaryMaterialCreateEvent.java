package fi.otavanopisto.muikku.plugins.material.events;

import fi.otavanopisto.muikku.model.material.BinaryMaterial;

public class BinaryMaterialCreateEvent extends MaterialCreateEvent<BinaryMaterial> {

  public BinaryMaterialCreateEvent(BinaryMaterial material) {
    super(material);
  }
  
}
