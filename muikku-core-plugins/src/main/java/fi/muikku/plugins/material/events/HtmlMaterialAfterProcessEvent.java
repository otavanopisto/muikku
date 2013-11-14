package fi.muikku.plugins.material.events;

import org.w3c.dom.Document;

public class HtmlMaterialAfterProcessEvent extends AbstractHtmlMaterialDomEvent {

  public HtmlMaterialAfterProcessEvent() {
  }
  
  public HtmlMaterialAfterProcessEvent(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
