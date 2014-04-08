package fi.muikku.plugins.search;

import java.io.IOException;
import java.util.Iterator;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;

import fi.muikku.dao.events.IndexAddEvent;
import fi.muikku.dao.events.IndexRemoveEvent;

@Stateless
public class IndexListener {

  @Any
  @Inject
  private Instance<SearchProvider> searchProviders;

  public void onIndexAdded(@Observes IndexAddEvent indexAddEvent) throws JsonGenerationException, JsonMappingException, IOException {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      provider.addToIndex(indexAddEvent.getField());
    }
  }

  public void onIndexRemoved(@Observes IndexRemoveEvent indexRemoveEvent) throws JsonGenerationException, JsonMappingException, IOException {
    Iterator<SearchProvider> providers = searchProviders.iterator();
    while (providers.hasNext()) {
      SearchProvider provider = providers.next();
      provider.deleteFromIndex(indexRemoveEvent.getField());
    }
  }

}
