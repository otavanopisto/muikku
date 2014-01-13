package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialCreateEvent extends MaterialCreateEvent<BinaryMaterial> {

  public BinaryMaterialCreateEvent(BinaryMaterial material) {
    super(material);
  }
  
}
