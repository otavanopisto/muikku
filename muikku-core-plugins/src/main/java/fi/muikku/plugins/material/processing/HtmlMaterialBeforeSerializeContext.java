package fi.muikku.plugins.material.processing;

import org.w3c.dom.Document;

public class HtmlMaterialBeforeSerializeContext extends AbstractHtmlMaterialDomProcessingContext {

  public HtmlMaterialBeforeSerializeContext() {
  }
  
  public HtmlMaterialBeforeSerializeContext(Long materialId, Document document) {
    super(materialId, document);
  }
  
}
