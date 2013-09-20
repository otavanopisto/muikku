package fi.muikku.plugins.material;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugins.material.controller.HtmlMaterialBackingBean;
import fi.muikku.plugins.material.renderer.CompositeMaterialRenderer;
import fi.muikku.plugins.material.renderer.HtmlMaterialRenderer;

public class MaterialPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "material";
  }

  @Override
  public void init() {
    
  }

  @Override
  public List<Class<?>> getBeans() {
    return Arrays.asList(new Class<?>[] {
       HtmlMaterialRenderer.class, 
       CompositeMaterialRenderer.class,
       MaterialViewBackingBean.class,
       HtmlMaterialBackingBean.class
    });
  }
}
