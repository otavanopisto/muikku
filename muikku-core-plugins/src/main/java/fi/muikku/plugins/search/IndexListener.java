package fi.muikku.plugins.search;

import java.beans.IntrospectionException;
import java.lang.reflect.InvocationTargetException;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.dao.events.EntityAddEvent;
import fi.muikku.dao.events.EntityRemoveEvent;

@Stateless
public class IndexListener {

  @Any
  @Inject
  private Instance<SearchProvider> searchProviders;

  @Inject
  private IndexEntityProcessor indexEntityProcessor;

  @Inject
  private Logger logger;

  public void onIndexAdded(@Observes EntityAddEvent entityAddEvent) {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      try {
        Map<String, Object> indexEntity = indexEntityProcessor.process(entityAddEvent.getEntity());
        if (indexEntity != null) {
          provider.addOrUpdateIndex(entityAddEvent.getEntity().getClass().getSimpleName(), indexEntity);
        }
      } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }

  public void onIndexRemoved(@Observes EntityRemoveEvent entityRemoveEvent) {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      try {
        Map<String, Object> indexEntity = indexEntityProcessor.process(entityRemoveEvent.getEntity());
        if (indexEntity != null) {
          provider.deleteFromIndex(entityRemoveEvent.getEntity().getClass().getSimpleName(), (Long) indexEntity.get("id"));
        }
      } catch (IllegalArgumentException | IllegalAccessException | SecurityException | InvocationTargetException | IntrospectionException | IndexIdMissingException e) {
        logger.log(Level.WARNING, "Entity processing exception", e);
      }
    }
  }

}
