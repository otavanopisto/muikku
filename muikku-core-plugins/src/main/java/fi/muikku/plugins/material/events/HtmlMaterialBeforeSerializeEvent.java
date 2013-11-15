package fi.muikku.plugins.material.events;

import org.w3c.dom.Document;

public class HtmlMaterialBeforeSerializeEvent extends AbstractHtmlMaterialDomEvent {

  public HtmlMaterialBeforeSerializeEvent() {
  }
  
  public HtmlMaterialBeforeSerializeEvent(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
