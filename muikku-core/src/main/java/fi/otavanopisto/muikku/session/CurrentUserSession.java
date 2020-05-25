package fi.otavanopisto.muikku.session;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;

@SessionScoped
@Stateful
public class CurrentUserSession {

  @Inject
  private transient SessionController sessionController;
  
  @Inject
  private transient UserSchoolDataController userSchoolDataController;
  
  public boolean isActive() {
    System.out.println(String.format("isActive loaded=%b, active=%b, user=%s", isActiveLoaded, isActive, sessionController.getLoggedUser()));
    if (!isActiveLoaded) {
      if (sessionController.isLoggedIn()) {
        User user = userSchoolDataController.findUser(sessionController.getLoggedUser());
        isActive = userSchoolDataController.isActiveUser(user);
        isActiveLoaded = true;
        
        System.out.println(String.format("isActive LOADED active=%b, user=%s", isActive, sessionController.getLoggedUser()));
      }
    }
    
    return isActive;
  }
  
  private boolean isActiveLoaded = false;
  private boolean isActive = false;
}
