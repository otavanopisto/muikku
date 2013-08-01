package fi.muikku.material;

import fi.muikku.model.material.Material;

public interface MaterialRenderer {
  public String getTargetType();
  public String renderView(Material material);
  public String renderEditor(Material material);
  public String renderWithReplies(Material material);
}
