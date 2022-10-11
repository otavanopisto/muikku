package fi.otavanopisto.muikku.session;

import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
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
    ensureInitialization();
    return isActive;
  }

  public Set<SchoolDataIdentifier> getStudyProgrammeIdentifiers() {
    ensureInitialization();
    return studyProgrammeIdentifiers;
  }
  
  private void ensureInitialization() {
    if (!initialized) {
      if (sessionController.isLoggedIn()) {
        try {
          User user = userSchoolDataController.findUser(sessionController.getLoggedUser());
          isActive = userSchoolDataController.isActiveUser(user);
          studyProgrammeIdentifiers = user.getStudyProgrammeIdentifiers();
          initialized = true;
        }
        catch (Exception ex) {
          logger.log(Level.SEVERE, "Failed to resolve user information.", ex);
        }
      }
    }
  }
  
  private boolean initialized = false;
  private boolean isActive = false;
  private Set<SchoolDataIdentifier> studyProgrammeIdentifiers;
}
