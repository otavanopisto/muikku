package fi.muikku.search;

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
  private Instance<SearchProvider> searchProviders;

  @Inject
  private IndexEntityProcessor indexEntityProcessor;

  @Inject
  private Logger logger;

  public void index(String name, Object entity) {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      try {
        Map<String, Object> indexEntity = indexEntityProcessor.process(entity);
        if (indexEntity != null) {
          provider.addOrUpdateIndex(name, indexEntity);
        }
      } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }
  
  public void remove(String name, Object entity) {
    try {
      Map<String, Object> indexEntity = indexEntityProcessor.process(entity);
      if (indexEntity != null) {
        remove(name, indexEntity.get("id").toString());
      }
    } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
      logger.log(Level.WARNING, "Entity processing exception", e);
    }
  }
  
  public void remove(String name, String id) {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      try {
        provider.deleteFromIndex(name, id);
      } catch (IllegalArgumentException | SecurityException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }
  
}
