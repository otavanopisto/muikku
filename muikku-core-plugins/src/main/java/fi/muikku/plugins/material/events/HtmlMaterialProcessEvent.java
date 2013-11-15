package fi.muikku.plugins.material.events;

import org.w3c.dom.Document;

public class HtmlMaterialProcessEvent extends AbstractHtmlMaterialDomEvent {

  public HtmlMaterialProcessEvent() {
  }
  
  public HtmlMaterialProcessEvent(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
