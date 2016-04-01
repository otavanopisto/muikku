package fi.otavanopisto.muikku.plugins.seeker.defaultproviders;

import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.search.SearchResultProcessor;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

public class WorkspaceSeekerResultProvider extends AbstractSeekerResultProvider {

  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      SearchResult result = elasticSearchProvider.searchWorkspaces(searchTerm, 0, 10);
      return searchResultProcessor.process(result);
    }
    return null;
  }
  
  @Override
  public String getName() {
    return "Workspaces";
  }

  @Override
  public int getWeight() {
    return 1;
  }
  
}
