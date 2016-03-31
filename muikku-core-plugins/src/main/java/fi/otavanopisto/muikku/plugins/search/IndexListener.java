package fi.otavanopisto.muikku.plugins.search;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import fi.otavanopisto.muikku.dao.events.EntityAddEvent;
import fi.otavanopisto.muikku.dao.events.EntityRemoveEvent;
import fi.otavanopisto.muikku.search.SearchIndexer;

@Stateless
public class IndexListener {

  @Inject
  private SearchIndexer indexer;
  
  public void onIndexAdded(@Observes EntityAddEvent entityAddEvent) {
    indexer.index(entityAddEvent.getEntity().getClass().getSimpleName(), entityAddEvent.getEntity());
  }

  public void onIndexRemoved(@Observes EntityRemoveEvent entityRemoveEvent) {
    indexer.remove(entityRemoveEvent.getEntity().getClass().getSimpleName(), entityRemoveEvent.getEntity());
  }

}
