package fi.muikku.plugins.materialfields;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;

public class MaterialHtmlFieldPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "materialhtmlembed";
  }

  @Override
  public void init() {
    
  }

  @Override
  public List<Class<?>> getBeans() {
    return Arrays.asList(new Class<?>[] {
        
      /* Listeners */
      
      HtmlMaterialFieldListeners.class
    });
  }

}
