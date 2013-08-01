package fi.muikku.plugins.material.renderer;

import javax.enterprise.context.ApplicationScoped;

import fi.muikku.model.material.Material;
import fi.muikku.material.MaterialRenderer;

@ApplicationScoped
public class HtmlMaterialRenderer implements MaterialRenderer {

  @Override
  public String getTargetType() {
    return "html";
  }

  @Override
  public String renderView(Material material) {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
    "<ui:composition xmlns=\"http://www.w3.org/1999/xhtml\" " +
    "xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" " +
    "xmlns:ui=\"http://java.sun.com/jsf/facelets\" " +
    "xmlns:f=\"http://java.sun.com/jsf/core\" " +
    "xmlns:h=\"http://java.sun.com/jsf/html\"> " +
    material.getCharacterData() +
    "</ui:composition>";
  }

  @Override
  public String renderEditor(Material material) {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public String renderWithReplies(Material material) {
    // TODO Auto-generated method stub
    return null;
  }

}
