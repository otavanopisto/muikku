package fi.muikku.plugins.material.processing;

import org.w3c.dom.Document;

public class HtmlMaterialAfterProcessingContext extends AbstractHtmlMaterialDomProcessingContext {

  public HtmlMaterialAfterProcessingContext() {
  }
  
  public HtmlMaterialAfterProcessingContext(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
