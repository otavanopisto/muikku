package fi.muikku.plugins.seeker.defaultproviders;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.plugins.search.SearchResultProcessor;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.schooldata.entity.Workspace;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;

public class WorkspaceSeekerResultProvider extends AbstractSeekerResultProvider {

  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      String[] fields = new String[] { "name", "description", "courseIdentifierIdentifier" };
      SearchResult result = elasticSearchProvider.search(searchTerm, fields, 0, 10, Workspace.class);
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
