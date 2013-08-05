package fi.muikku.plugins.material.renderer;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.material.Material;
import fi.muikku.material.MaterialRenderStrategy;
import fi.muikku.material.MaterialRenderer;

@ApplicationScoped
public class HtmlMaterialRenderer extends MaterialRenderer {

  @Override
  public String getTargetType() {
    return "html";
  }

  @Override
  public String renderFragment(MaterialRenderStrategy renderStrategy, Material material) {
    return material.getCharacterData(); // TODO: Editor
  }
}
