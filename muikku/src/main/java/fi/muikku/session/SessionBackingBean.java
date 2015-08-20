package fi.muikku.session;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.schooldata.entity.User;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

  @Inject
  private EnvironmentUserController environmentUserController;

  @Inject
  private SessionController sessionController;

  @Inject
  private UserController userController;

  @PostConstruct
  public void init() {
    loggedUserRoleArchetype = null;
    loggedUserName = null;

    if (sessionController.isLoggedIn()) {
      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getLoggedUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getLoggedUserIdentifier();
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(loggedUser);
        if (environmentUser != null) {
          loggedUserRoleArchetype = environmentUser.getRole().getArchetype();
        }

        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {
          loggedUserName = user.getDisplayName();
        }
      }

    }
  }

  public boolean getLoggedIn() {
    return sessionController.isLoggedIn();
  }

  public Long getLoggedUserId() {
    return sessionController.isLoggedIn() ? sessionController.getLoggedUserEntity().getId() : null;
  }

  public String getResourceLibrary() {
    return "theme-muikku";
  }

  public boolean getTeacherLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.TEACHER;
  }

  public boolean getManagerLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.MANAGER;
  }

  public boolean getAdministratorLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.ADMINISTRATOR;
  }

  public boolean getStudentLoggedIn() {
    return loggedUserRoleArchetype == EnvironmentRoleArchetype.STUDENT;
  }

  public String getLoggedUserName() {
    return loggedUserName;
  }
  
  public String getCurrentCountry() {
    return sessionController.getLocale().getCountry();
  }
  
  private EnvironmentRoleArchetype loggedUserRoleArchetype;
  private String loggedUserName;
}
