package fi.muikku.plugins.material.processing;

import org.w3c.dom.Document;

public class HtmlMaterialProcessingContext extends AbstractHtmlMaterialDomProcessingContext {

  public HtmlMaterialProcessingContext() {
  }
  
  public HtmlMaterialProcessingContext(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
