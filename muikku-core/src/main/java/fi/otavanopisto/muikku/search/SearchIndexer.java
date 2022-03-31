package fi.otavanopisto.muikku.search;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

public class SearchIndexer {

  @Any
  @Inject
  private Instance<SearchIndexUpdater> searchIndexUpdaters;

  @Inject
  private IndexEntityProcessor indexEntityProcessor;

  @Inject
  private Logger logger;

  public void index(String indexName, String typeName, Object entity) {
    index(indexName, typeName, entity, null);
  }
  
  public void index(String indexName, String typeName, Object entity, Map<String, Object> extraProperties) {
    Iterator<SearchIndexUpdater> updaters = searchIndexUpdaters.iterator();
    while (updaters.hasNext()) {
      SearchIndexUpdater updater = updaters.next();
      try {
        Map<String, Object> indexEntity = indexEntityProcessor.process(entity);
        if (indexEntity != null) {
          if (extraProperties != null) {
            for (String key : extraProperties.keySet()) {
              Object value = extraProperties.get(key);
              indexEntity.put(key, value);
            }
          }
          
          updater.addOrUpdateIndex(indexName, typeName, indexEntity);
        }
      } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }
  
  public void remove(String indexName, String typeName, Object entity) {
    try {
      Map<String, Object> indexEntity = indexEntityProcessor.process(entity);
      if (indexEntity != null) {
        remove(indexName, typeName, indexEntity.get("id").toString());
      }
    } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
      logger.log(Level.WARNING, "Entity processing exception", e);
    }
  }
  
  public void remove(String indexName, String typeName, String id) {
    Iterator<SearchIndexUpdater> providers = searchIndexUpdaters.iterator();
    while (providers.hasNext()) {
      SearchIndexUpdater provider = providers.next();
      try {
        provider.deleteFromIndex(indexName, typeName, id);
      } catch (IllegalArgumentException | SecurityException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }
  
}
