package fi.otavanopisto.muikku.plugins.material.operations;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.material.HtmlMaterialController;
import fi.otavanopisto.muikku.plugins.material.MaterialController;
import fi.otavanopisto.muikku.plugins.material.model.HtmlMaterial;
import fi.otavanopisto.muikku.plugins.material.model.MaterialProducer;

public class HtmlMaterialCloneOperation implements MaterialCloneOperation<HtmlMaterial> {
  
  @Inject
  private MaterialController materialController;

  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Override
  public HtmlMaterial clone(HtmlMaterial material) {
    HtmlMaterial clonedMaterial = htmlMaterialController.createHtmlMaterial(material.getTitle(), material.getHtml(), material.getContentType(), material.getLicense(), material.getViewRestrict());
    List<MaterialProducer> materialProducers = materialController.listMaterialProducers(material);
    for (MaterialProducer materialProducer : materialProducers) {
      materialController.createMaterialProducer(clonedMaterial, materialProducer.getName());
    }
    return clonedMaterial;
  }
  
}
