package fi.muikku.controller;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.material.MaterialRenderer;
import fi.muikku.material.MaterialRendererRepository;
import fi.muikku.model.material.Material;

@Dependent
public class MaterialController {
  
  @Inject
  private MaterialRendererRepository materialRendererRepository;
  
  public String renderView(Material material) {
    MaterialRenderer materialRenderer = materialRendererRepository.getRendererFor(material.getType());
    if (materialRenderer != null) {
      return materialRenderer.renderView(material);
    } else {
      return null;
    }
  }

  public String renderEditor(Material material) {
    MaterialRenderer materialRenderer = materialRendererRepository.getRendererFor(material.getType());
    if (materialRenderer != null) {
      return materialRenderer.renderEditor(material);
    } else {
      return null;
    }
  }

}
