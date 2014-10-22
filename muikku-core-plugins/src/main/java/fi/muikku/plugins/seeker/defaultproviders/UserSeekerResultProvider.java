package fi.muikku.plugins.seeker.defaultproviders;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.plugins.schooldatalocal.model.LocalUser;
import fi.muikku.plugins.search.SearchProvider;
import fi.muikku.plugins.search.SearchResult;
import fi.muikku.plugins.search.SearchResultProcessor;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;

public class UserSeekerResultProvider extends AbstractSeekerResultProvider {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private SearchResultProcessor searchResultProcessor;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private UserController userController;
  
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
    //return seekerify(userController.listEnvironmentUsers(), searchTerm);
  }

  /*private List<SeekerResult> seekerify(List<EnvironmentUser> list, String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();

    searchTerm = searchTerm.toLowerCase();
    String caption = localeController.getText(sessionController.getLocale(), "plugin.seeker.category.users");
    String imageUrl;
    
    for (EnvironmentUser e : list) {
      User e2 = userController.findUser(e.getUser());

      if (userController.hasPicture(e.getUser()))
        imageUrl = "/picture?userId=" + e.getUser().getId();
      else
    
        // TODO teematuki
        
        imageUrl = "/tmp/userprofile.png";
     
      // TODO remove
      if ((e2.getFirstName().toLowerCase().contains(searchTerm)) || (e2.getLastName().toLowerCase().contains(searchTerm)))
        result.add(new UserSeekerResult(e2.getFirstName() + " " + e2.getLastName(), caption, "/user/" + e.getId(), imageUrl));
    }
    
    return result;
  }*/

  
  @Override
  public String getName() {
    return "Users";
  }
  
}
