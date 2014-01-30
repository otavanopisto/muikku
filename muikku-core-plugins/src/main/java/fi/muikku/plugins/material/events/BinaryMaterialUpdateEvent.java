package fi.muikku.plugins.material.events;

import fi.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialUpdateEvent extends MaterialUpdateEvent<BinaryMaterial> {

  public BinaryMaterialUpdateEvent(BinaryMaterial material) {
    super(material);
  }
  
}
