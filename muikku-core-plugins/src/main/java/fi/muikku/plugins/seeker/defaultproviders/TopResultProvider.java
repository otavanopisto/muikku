package fi.muikku.plugins.seeker.defaultproviders;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatalocal.dao.LocalUserDAO;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.search.ElasticSearchProvider;
import fi.muikku.plugins.search.SearchProvider;
import fi.muikku.plugins.search.SearchResult;
import fi.muikku.plugins.search.SearchResultProcessor;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultParser;
import fi.muikku.plugins.seeker.SeekerResultProvider;

public class TopResultProvider extends AbstractSeekerResultProvider {
  
  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Inject
  private LocalUserDAO localUserDAO;

  @Inject
  private Logger logger;
  
  @Override
  public String getName() {
    return "Top Result";
  }

  @Override
  public List<SeekerResult> search(String searchTerm) {

    /*
     * List<LocalUser> users = localUserDAO.listAll(); for(LocalUser user : users){ localUserDAO.updateFirstName(user, user.getFirstName()); }
     */
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      SearchResult result = elasticSearchProvider.freeTextSearch(searchTerm, 0, 1);
      return searchResultProcessor.process(result);
    }
    return null;
  }

}
