package fi.muikku.plugins.material.events;

import org.w3c.dom.Document;

public class HtmlMaterialBeforeProcessEvent extends AbstractHtmlMaterialDomEvent {

  public HtmlMaterialBeforeProcessEvent() {
  }
  
  public HtmlMaterialBeforeProcessEvent(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
