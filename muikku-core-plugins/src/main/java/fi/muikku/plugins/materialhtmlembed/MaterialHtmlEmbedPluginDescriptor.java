package fi.muikku.plugins.materialhtmlembed;

import java.util.Arrays;
import java.util.List;

import fi.muikku.plugin.PluginDescriptor;

public class MaterialHtmlEmbedPluginDescriptor implements PluginDescriptor {

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
      
      HtmlMaterialEmbedHtmlMaterialProcessListener.class
    });
  }

}
