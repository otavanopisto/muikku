package fi.otavanopisto.muikku.session;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.controller.SystemSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentUser;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.EnvironmentUserController;
import fi.otavanopisto.muikku.users.UserController;

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
  private SystemSettingsController systemSettingsController;

  @PostConstruct
  public void init() {
    loggedUserRoleArchetype = null;
    loggedUserName = null;
    testsRunning = StringUtils.equals("true", System.getProperty("tests.running"));
    bugsnagApiKey = systemSettingsController.getSetting("bugsnagApiKey");
    bugsnagEnabled = StringUtils.isNotBlank(bugsnagApiKey);    
    loggedUserId = null;
    loggedUser = null;
    
    if (sessionController.isLoggedIn()) {
      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getLoggedUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getLoggedUserIdentifier();
        EnvironmentUser environmentUser = environmentUserController.findEnvironmentUserByUserEntity(loggedUser);
        if ((environmentUser != null) && (environmentUser.getRole() != null)) {
          loggedUserRoleArchetype = environmentUser.getRole().getArchetype();
        }

        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {
          loggedUserName = user.getDisplayName();
        }
      }

      this.loggedUserId = sessionController.getLoggedUserEntity().getId();
      this.loggedUser = sessionController.getLoggedUser().toId();
    }
  }

  public boolean getLoggedIn() {
    return sessionController.isLoggedIn();
  }

  public Long getLoggedUserId() {
    return loggedUserId;
  }
  
  public String getLoggedUser() {
    return loggedUser;
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
  
  public boolean getTestsRunning() {
    return testsRunning;
  }
  
  public String getBugsnagApiKey() {
    return bugsnagApiKey;
  }
  
  public boolean getBugsnagEnabled() {
    return bugsnagEnabled;
  }
  
  private String loggedUser;
  private Long loggedUserId;
  private EnvironmentRoleArchetype loggedUserRoleArchetype;
  private String loggedUserName;
  private boolean testsRunning;
  private String bugsnagApiKey;
  private boolean bugsnagEnabled;
}
