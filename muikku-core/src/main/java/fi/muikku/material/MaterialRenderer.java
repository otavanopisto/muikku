package fi.muikku.material;

import fi.muikku.model.material.Material;

public abstract class MaterialRenderer {
  public abstract String getTargetType();
  
  // Or these.
  public abstract String renderViewFragment(Material material);
  public abstract String renderEditorFragment(Material material);
  public abstract String renderWithRepliesFragment(Material material);
  
  private String wrapWithJSF(String source) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
        "<ui:composition xmlns=\"http://www.w3.org/1999/xhtml\" " +
        "xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" " +
        "xmlns:ui=\"http://java.sun.com/jsf/facelets\" " +
        "xmlns:f=\"http://java.sun.com/jsf/core\" " +
        "xmlns:h=\"http://java.sun.com/jsf/html\"> " +
        source +
    "</ui:composition>";
  }
  // Maybe these should be in MaterialController?
  public String renderView(Material material) {
    return wrapWithJSF(renderViewFragment(material));
  }
  public String renderEditor(Material material) {
    return wrapWithJSF(renderEditorFragment(material));
  }
  public String renderWithReplies(Material material) {
    return wrapWithJSF(renderWithRepliesFragment(material));
  }
}
