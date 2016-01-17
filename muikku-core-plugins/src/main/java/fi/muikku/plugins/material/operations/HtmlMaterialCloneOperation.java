package fi.muikku.plugins.material.operations;

import javax.inject.Inject;

import fi.muikku.plugins.material.HtmlMaterialController;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialCloneOperation implements MaterialCloneOperation<HtmlMaterial> {
  
  @Inject
  private HtmlMaterialController htmlMaterialController;

  @Override
  public HtmlMaterial clone(HtmlMaterial material) {
    return htmlMaterialController.createHtmlMaterial(material.getTitle(), material.getHtml(), material.getContentType(), material.getRevisionNumber(), material);
  }
  
}
