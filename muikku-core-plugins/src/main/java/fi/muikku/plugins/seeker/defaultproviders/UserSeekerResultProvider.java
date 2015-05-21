package fi.muikku.plugins.seeker.defaultproviders;

import java.util.List;

import javax.inject.Inject;

import fi.muikku.plugins.search.SearchResultProcessor;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.schooldata.entity.User;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;
import fi.muikku.session.SessionController;

public class UserSeekerResultProvider extends AbstractSeekerResultProvider {
  
  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    if (!sessionController.isLoggedIn())
      return null;
    
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      String[] fields = new String[] { "firstName", "lastName"};
      SearchResult result = elasticSearchProvider.search(searchTerm, fields, 0, 10, User.class);
      return searchResultProcessor.process(result);
    }
    
    return null;
  }
  
  @Override
  public String getName() {
    return "Users";
  }

  @Override
  public int getWeight() {
    return 1;
  }
  
}
