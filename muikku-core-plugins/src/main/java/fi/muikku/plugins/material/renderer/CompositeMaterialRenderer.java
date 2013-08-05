package fi.muikku.plugins.material.renderer;

import java.util.ArrayList;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.MaterialController;
import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;
import fi.muikku.material.MaterialRenderStrategy;
import fi.muikku.material.MaterialRenderer;
import fi.muikku.material.MaterialRendererRepository;

@ApplicationScoped
public class CompositeMaterialRenderer extends MaterialRenderer {

  @Inject
  private MaterialDAO materialDAO;
  
  @Inject
  private MaterialRendererRepository materialRendererRepository;
  
  @Override
  public String getTargetType() {
    return "composite";
  }

  @Override
  public String renderFragment(MaterialRenderStrategy renderStrategy, Material material) {
    StringBuffer stringBuffer = new StringBuffer();
    for (String num : material.getCharacterData().split(",")) {
      long id = Long.parseLong(num);
      Material innerMaterial = materialDAO.findById(id);
      MaterialRenderer materialRenderer = materialRendererRepository.getRendererFor(innerMaterial.getType());
      stringBuffer.append(materialRenderer.renderFragment(renderStrategy, innerMaterial));
    }
    return stringBuffer.toString();
  }
}
