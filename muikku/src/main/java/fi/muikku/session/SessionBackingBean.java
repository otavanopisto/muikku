package fi.muikku.session;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.model.users.EnvironmentUser;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.users.UserSchoolDataIdentifier;
import fi.muikku.schooldata.entity.User;
import fi.muikku.users.EnvironmentUserController;
import fi.muikku.users.UserController;
import fi.muikku.users.UserSchoolDataIdentifierController;

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

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  private List<AlternativeIdentity> alternativeIdentities;

  @PostConstruct
  public void init() {
    loggedUserRoleArchetype = null;
    loggedUserName = null;

    if (sessionController.isLoggedIn()) {
      alternativeIdentities = new ArrayList<>();

      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getActiveUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getActiveUserIdentifier();
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(loggedUser);
        if (environmentUser != null) {
          loggedUserRoleArchetype = environmentUser.getRole().getArchetype();
        }

        // TODO: This is quite heavy operation to do in every request.
        for (UserSchoolDataIdentifier identifier : userSchoolDataIdentifierController.listUserSchoolDataIdentifiersByUserEntity(loggedUser)) {
          if (!(activeSchoolDataSource.equals(identifier.getDataSource().getIdentifier()) && activeUserIdentifier.equals(identifier.getIdentifier()))) {
            User user = userController.findUserByDataSourceAndIdentifier(identifier.getDataSource(), identifier.getIdentifier());
            if (user != null) {
              String displayName = user.getFirstName() + ' ' + user.getLastName()+ ' ' + user.getSchoolDataSource() + " / " + user.getIdentifier();
              alternativeIdentities.add(new AlternativeIdentity(displayName, identifier.getIdentifier(), identifier.getDataSource().getIdentifier()));
            }
          }
        }
        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {
          loggedUserName = user.getFirstName() + ' ' + user.getLastName();
        }
      }

    }
  }

  public String changeUserIdentity(AlternativeIdentity identity) {
    sessionController.setActiveUserIdentifier(identity.getSchoolDataSource(), identity.getIdentifier());
    return "/index.jsf?faces-redirect=true";
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

  public List<AlternativeIdentity> getAlternativeIdentities() {
    return alternativeIdentities;
  }

  private EnvironmentRoleArchetype loggedUserRoleArchetype;
  private String loggedUserName;
}
