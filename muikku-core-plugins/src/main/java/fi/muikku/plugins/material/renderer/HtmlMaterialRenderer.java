package fi.muikku.plugins.material.renderer;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.material.Material;
import fi.muikku.material.MaterialRenderer;

@ApplicationScoped
public class HtmlMaterialRenderer extends MaterialRenderer {

  @Override
  public String getTargetType() {
    return "html";
  }

  @Override
  public String renderViewFragment(Material material) {
    return material.getCharacterData();
  }

  @Override
  public String renderEditorFragment(Material material) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public String renderWithRepliesFragment(Material material) {
    // TODO Auto-generated method stub
    return null;
  }
}
