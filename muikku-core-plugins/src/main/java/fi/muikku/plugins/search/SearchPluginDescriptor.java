package fi.muikku.plugins.search;

import java.util.Iterator;
import java.util.logging.Logger;

import javax.annotation.PreDestroy;
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
      logger.info("Initializing search provider: " + provider.getName());
      provider.init();
    }
  }
  
  @PreDestroy
  public void deinit() {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while(i.hasNext()){
      SearchProvider provider = i.next();
      logger.info("Deinitializing search provider: " + provider.getName());
      provider.deinit();
    }
  }
  
  @Override
  public String getName() {
    return "search";
  }

}
