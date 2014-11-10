package fi.muikku.plugins.search;

import java.util.Iterator;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.search.SearchProvider;

public class SearchPluginDescriptor implements PluginDescriptor {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  private Logger logger;
  
  @Override
  public void init() {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while(i.hasNext()){
      SearchProvider provider = i.next();
      logger.info("Initializing search provider: "+provider.getName());
      provider.init();
    }
  }

  @Override
  public String getName() {
    return "search";
  }

}
