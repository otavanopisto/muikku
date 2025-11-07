package fi.otavanopisto.muikku.plugins.material.operations;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.BinaryMaterialController;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.BinaryMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialProducer;

public class BinaryMaterialCloneOperation implements MaterialCloneOperation<BinaryMaterial> {
  
  @Inject
  private MaterialController materialController;

  @Inject
  private BinaryMaterialController binaryMaterialController;

  @Override
  public BinaryMaterial clone(BinaryMaterial material) {
    BinaryMaterial clonedMaterial = binaryMaterialController.createBinaryMaterial(material.getTitle(), material.getContentType(), material.getContent(), material.getLicense(), material.getViewRestrict());
    List<MaterialProducer> materialProducers = materialController.listMaterialProducers(material);
    for (MaterialProducer materialProducer : materialProducers) {
      materialController.createMaterialProducer(clonedMaterial, materialProducer.getName());
    }
    return clonedMaterial;
  }
  
}
