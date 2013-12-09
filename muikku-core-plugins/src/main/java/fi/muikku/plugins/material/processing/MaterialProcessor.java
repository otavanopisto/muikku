package fi.muikku.plugins.material.processing;

import org.w3c.dom.Document;

public interface MaterialProcessor {
  
  public void beforeProcessMaterial(HtmlMaterialBeforeProcessingContext context);
  
  public void processMaterial(HtmlMaterialProcessingContext context);
  
  public void afterProcessMaterial(HtmlMaterialAfterProcessingContext context);
  
  public void beforeSerializeMaterial(HtmlMaterialBeforeSerializeContext context);
  
  public int getProcessingStage();
}
