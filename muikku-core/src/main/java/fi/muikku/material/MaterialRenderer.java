package fi.muikku.material;

import fi.muikku.model.material.Material;

public abstract class MaterialRenderer {
  public abstract String getTargetType();
  public abstract String renderFragment(MaterialRenderStrategy strategy, Material material);
  
  // Maybe these should be in MaterialController?
  public String renderView(Material material) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<ui:composition xmlns=\"http://www.w3.org/1999/xhtml\" " +
        "xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" " +
        "xmlns:ui=\"http://java.sun.com/jsf/facelets\" " +
        "xmlns:f=\"http://java.sun.com/jsf/core\" " +
        "xmlns:h=\"http://java.sun.com/jsf/html\"> " +
        renderFragment(MaterialRenderStrategy.VIEW, material) +
    "</ui:composition>";
  }
  public String renderEditor(Material material) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<ui:composition xmlns=\"http://www.w3.org/1999/xhtml\" " +
        "xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" " +
        "xmlns:ui=\"http://java.sun.com/jsf/facelets\" " +
        "xmlns:f=\"http://java.sun.com/jsf/core\" " +
        "xmlns:h=\"http://java.sun.com/jsf/html\"> " +
        renderFragment(MaterialRenderStrategy.EDITOR, material) +
    "</ui:composition>";
  }
  public String renderWithReplies(Material material) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<ui:composition xmlns=\"http://www.w3.org/1999/xhtml\" " +
        "xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" " +
        "xmlns:ui=\"http://java.sun.com/jsf/facelets\" " +
        "xmlns:f=\"http://java.sun.com/jsf/core\" " +
        "xmlns:h=\"http://java.sun.com/jsf/html\"> " +
        renderFragment(MaterialRenderStrategy.WITH_REPLIES, material) +
    "</ui:composition>";
  }
}
