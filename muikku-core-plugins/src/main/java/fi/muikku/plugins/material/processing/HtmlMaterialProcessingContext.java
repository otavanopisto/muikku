package fi.muikku.plugins.material.processing;

import org.w3c.dom.Document;

public class HtmlMaterialProcessingContext extends AbstractHtmlMaterialDomProcessingContext {

  public HtmlMaterialProcessingContext() {
  }
  
  public HtmlMaterialProcessingContext(String fieldPrefix, Long materialId, Document document) {
    super(fieldPrefix, materialId, document);
  }
  
}
