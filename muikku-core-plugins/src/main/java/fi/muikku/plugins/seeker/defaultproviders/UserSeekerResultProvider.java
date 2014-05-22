package fi.muikku.plugins.seeker.defaultproviders;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.i18n.LocaleController;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.plugins.seeker.DefaultSeekerResultImpl;
import fi.muikku.plugins.seeker.SeekerResult;
import fi.muikku.plugins.seeker.SeekerResultProvider;
import fi.muikku.schooldata.UserController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.SessionController;

public class UserSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private SessionController sessionController;
  
  @Inject
  private LocaleController localeController;
  
  @Inject
  private UserController userController;
  
  @Override
  public List<SeekerResult> search(String searchTerm) {
    return seekerify(userController.listEnvironmentUsers(), searchTerm);
  }

  private List<SeekerResult> seekerify(List<EnvironmentUser> list, String searchTerm) {
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
  }
  
}
