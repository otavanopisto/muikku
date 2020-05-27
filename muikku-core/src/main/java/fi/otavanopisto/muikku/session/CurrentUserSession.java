package fi.otavanopisto.muikku.session;

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;

@SessionScoped
@Stateful
public class CurrentUserSession {

  @Inject
  private transient Logger logger;
  
  @Inject
  private transient SessionController sessionController;
  
  @Inject
  private transient UserSchoolDataController userSchoolDataController;
  
  public boolean isActive() {
    if (!isActiveLoaded) {
      if (sessionController.isLoggedIn()) {
        try {
          User user = userSchoolDataController.findUser(sessionController.getLoggedUser());
          isActive = userSchoolDataController.isActiveUser(user);
          isActiveLoaded = true;
        } catch (Exception ex) {
          logger.log(Level.SEVERE, "Failed to resolve user activity information.", ex);
        }
      }
    }
    
    return isActive;
  }
  
  private boolean isActiveLoaded = false;
  private boolean isActive = false;
}
