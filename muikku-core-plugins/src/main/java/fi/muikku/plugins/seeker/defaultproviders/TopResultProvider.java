package fi.muikku.plugins.seeker.defaultproviders;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import fi.muikku.plugins.schooldatalocal.dao.LocalUserDAO;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.search.ElasticSearchProvider;
import fi.muikku.plugins.search.SearchResult;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResultProvider;

public class TopResultProvider implements SeekerResultProvider {

  @Inject
  private ElasticSearchProvider elasticSearchProvider;

  @Inject
  private LocalUserDAO localUserDAO;

  @Override
  public String getName() {
    return "Top Result";
  }

  @Override
  public List<SeekerResult> search(String searchTerm) {
    /*
     * List<LocalUser> users = localUserDAO.listAll(); for(LocalUser user : users){ System.out.println(user.getFirstName()); localUserDAO.updateFirstName(user,
     * user.getFirstName()); }
     */
    SearchResult result = elasticSearchProvider.freeTextSearch(searchTerm, 0, 1);
    String label = "";
    if (result.getResults().size() > 0) {
      for (Map<String, Object> entry : result.getResults()) {
        for (String key : entry.keySet()) {
          if (key != "indexType") {
            Object value = entry.get(key);
            if (value instanceof String) {
              label += entry.get(key) + " ";
            }
          }
        }
      }
      ArrayList<SeekerResult> seekerResults = new ArrayList<SeekerResult>();
      seekerResults.add(new TopSeekerResult(this.getName(), label, "asd"));
      return seekerResults;
    } else {
      return null;
    }
  }

}
