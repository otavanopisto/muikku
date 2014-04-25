package fi.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class SearchPluginDescriptor implements PluginDescriptor {

  @Override
  public String getName() {
    return "search";
  }
  
  @Override
  public void init() {
  }

  @Override
  public List<Class<?>> getBeans() {
    return new ArrayList<Class<?>>(Arrays.asList(
        
        /* Search providers */
        
        ElasticSearchProvider.class,
        
        /* Listeners */
        
        IndexListener.class,
        
        /* Processors */
        
        IndexEntityProcessor.class
        
    ));
  }

}
