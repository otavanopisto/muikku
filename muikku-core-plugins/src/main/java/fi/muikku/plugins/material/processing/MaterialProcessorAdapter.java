package fi.muikku.plugins.material.processing;

public abstract class MaterialProcessorAdapter implements MaterialProcessor {

  @Override
  public void beforeProcessMaterial(HtmlMaterialBeforeProcessingContext context) {
  }

  @Override
  public void processMaterial(HtmlMaterialProcessingContext context) {
  }

  @Override
  public void afterProcessMaterial(HtmlMaterialAfterProcessingContext context) {
  }

  @Override
  public void beforeSerializeMaterial(HtmlMaterialBeforeSerializeContext context) {
  }

  @Override
  public int getProcessingStage() {
    return 0;
  }

}
