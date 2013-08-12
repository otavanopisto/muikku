package fi.muikku.plugins.material.renderer;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.dao.material.MaterialDAO;
import fi.muikku.model.material.Material;
import fi.muikku.material.MaterialRenderer;
import fi.muikku.material.MaterialRendererRepository;

@ApplicationScoped
public class CompositeMaterialRenderer extends MaterialRenderer {

  @Inject
  private MaterialDAO materialDAO;
  
  @Inject
  private MaterialRendererRepository materialRendererRepository;
  
  public String getTargetType() {
    return "composite";
  }
  
  @Override
  public String renderViewFragment(Material material) {
    StringBuffer stringBuffer = new StringBuffer();
    for (String num : material.getCharacterData().split(",")) {
      long id = Long.parseLong(num);
      Material innerMaterial = materialDAO.findById(id);
      MaterialRenderer materialRenderer = materialRendererRepository.getRendererFor(innerMaterial.getType());
      stringBuffer.append("<h1>" + innerMaterial.getTitle() + "</h1>");
      stringBuffer.append(materialRenderer.renderViewFragment(innerMaterial));
    }
    return stringBuffer.toString();
  }

  @Override
  public String renderEditorFragment(Material material) {
    return null;
  }

  @Override
  public String renderWithRepliesFragment(Material material) {
    return null;
  }
}
