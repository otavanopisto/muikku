package fi.muikku.plugins.seeker.defaultproviders;

import java.lang.reflect.Field;
import java.util.List;
import javax.inject.Inject;

import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.search.SearchProvider;
import fi.muikku.plugins.search.SearchResult;
import fi.muikku.plugins.search.SearchResultProcessor;
import fi.muikku.plugins.seeker.SeekerResult;

public class UserSeekerResultProvider extends AbstractSeekerResultProvider {
  
  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    SearchProvider elasticSearchProvider = getProvider("elastic-search");
    if (elasticSearchProvider != null) {
      Field[] declaredFields = LocalUser.class.getDeclaredFields();
      String[] fields = new String[declaredFields.length];
      for(int i = 0; i < declaredFields.length;i++){
        if(declaredFields[i].getType().equals(String.class)){
          fields[i] = declaredFields[i].getName(); 
        }
      }
      SearchResult result = elasticSearchProvider.search(searchTerm, fields, 0, 10, LocalUser.class);
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
