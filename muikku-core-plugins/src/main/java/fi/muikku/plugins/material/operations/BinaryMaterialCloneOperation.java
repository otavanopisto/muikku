package fi.muikku.plugins.material.operations;

import javax.inject.Inject;

import fi.muikku.plugins.material.BinaryMaterialController;
import fi.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialCloneOperation implements MaterialCloneOperation<BinaryMaterial> {
  
  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Override
  public BinaryMaterial clone(BinaryMaterial material) {
    return binaryMaterialController.createBinaryMaterial(material.getTitle(), material.getContentType(), material.getContent(), material);
  }
  
}
