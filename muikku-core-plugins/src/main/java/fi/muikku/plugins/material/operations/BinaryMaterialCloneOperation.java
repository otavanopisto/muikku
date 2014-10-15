package fi.muikku.plugins.material.operations;

import javax.inject.Inject;

import fi.muikku.plugins.material.dao.BinaryMaterialDAO;
import fi.muikku.plugins.material.model.BinaryMaterial;

public class BinaryMaterialCloneOperation implements MaterialCloneOperation<BinaryMaterial> {
  
  @Inject
  BinaryMaterialDAO binaryMaterialDAO;

  @Override
  public BinaryMaterial clone(BinaryMaterial material) {
    return binaryMaterialDAO.create(material.getTitle(), material.getContentType(), material.getContent(), material);
  }
  
}
