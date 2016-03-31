package fi.otavanopisto.muikku.plugins.search;

import java.util.Iterator;
import java.util.logging.Logger;

import javax.annotation.PreDestroy;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugin.PluginDescriptor;
import fi.otavanopisto.muikku.search.SearchIndexUpdater;
import fi.otavanopisto.muikku.search.SearchProvider;

public class SearchPluginDescriptor implements PluginDescriptor {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Inject
  @Any
  private Instance<SearchIndexUpdater> searchIndexUpdaters;
  
  @Inject
  private Logger logger;
  
  @Override
  public void init() {
    Iterator<SearchIndexUpdater> updaterIterator = searchIndexUpdaters.iterator();
    while(updaterIterator.hasNext()){
      SearchIndexUpdater updater = updaterIterator.next();
      logger.info("Initializing search index updater: " + updater.getName());
      updater.init();
    }
    
    Iterator<SearchProvider> providerIterator = searchProviders.iterator();
    while(providerIterator.hasNext()){
      SearchProvider provider = providerIterator.next();
      logger.info("Initializing search provider: " + provider.getName());
      provider.init();
    }
  }
  
  @PreDestroy
  public void deinit() {
    Iterator<SearchProvider> searchProviderIterator = searchProviders.iterator();
    while(searchProviderIterator.hasNext()){
      SearchProvider provider = searchProviderIterator.next();
      logger.info("Deinitializing search provider: " + provider.getName());
      provider.deinit();
    }
    
    Iterator<SearchIndexUpdater> updaterProviderIterator = searchIndexUpdaters.iterator();
    while(updaterProviderIterator.hasNext()){
      SearchIndexUpdater updater = updaterProviderIterator.next();
      logger.info("Deinitializing search index updater: " + updater.getName());
      updater.deinit();
    }
  }
  
  @Override
  public String getName() {
    return "search";
  }

}
