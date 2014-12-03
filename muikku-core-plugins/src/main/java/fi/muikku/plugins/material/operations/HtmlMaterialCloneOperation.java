package fi.muikku.plugins.material.operations;

import javax.inject.Inject;

import fi.muikku.plugins.material.dao.HtmlMaterialDAO;
import fi.muikku.plugins.material.model.HtmlMaterial;

public class HtmlMaterialCloneOperation implements MaterialCloneOperation<HtmlMaterial> {
  
  @Inject
  HtmlMaterialDAO htmlMaterialDAO;

  @Override
  public HtmlMaterial clone(HtmlMaterial material) {
    return htmlMaterialDAO.create(material.getTitle(), material.getHtml(), material.getContentType(), material.getRevisionNumber(), material);
  }
  
}
