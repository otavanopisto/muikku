package fi.muikku.material;

import java.util.HashMap;
import java.util.Map;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.plugin.AfterPluginsInitEvent;

@ApplicationScoped
public class MaterialRendererRepository {
  
  @Inject
  @Any
  Instance<MaterialRenderer> rendererInstanceCollection;

  public void registerRenderers(@Observes AfterPluginsInitEvent afterPluginsInitEvent) {
    for (MaterialRenderer materialRenderer : rendererInstanceCollection) {
      renderers.put(materialRenderer.getTargetType(), materialRenderer);
    }
  }
  
  public MaterialRenderer getRendererFor(String type) {
    return renderers.get(type);
  }
  
  private Map<String, MaterialRenderer> renderers = new HashMap<>();
}
