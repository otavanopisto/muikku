package fi.otavanopisto.muikku.plugins.seeker.defaultproviders;

import java.util.Iterator;
import java.util.List;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultProvider;
import fi.otavanopisto.muikku.search.SearchProvider;

public abstract class AbstractSeekerResultProvider implements SeekerResultProvider {

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
  @Override
  public abstract String getName();

  @Override
  public abstract List<SeekerResult> search(String searchTerm);
  
  protected SearchProvider getProvider(String name) {
    Iterator<SearchProvider> i = searchProviders.iterator();
    while (i.hasNext()) {
      SearchProvider provider = i.next();
      if (name.equals(provider.getName())) {
        return provider;
      }
    }
    return null;
  }

}
