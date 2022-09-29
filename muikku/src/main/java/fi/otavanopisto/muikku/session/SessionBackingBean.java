package fi.otavanopisto.muikku.session;

import java.util.Locale;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

@RequestScoped
@Named
@Stateful
public class SessionBackingBean {

  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private UserController userController;

  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;
  
  @Inject
  private CurrentUserSession currentUserSession;

  @PostConstruct
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void init() {
    loggedUserRoleArchetype = null;
    loggedUserName = null;
    loggedUserId = null;
    loggedUser = null;

    if (sessionController.isLoggedIn()) {
      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getLoggedUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getLoggedUserIdentifier();
        
        EnvironmentRoleEntity roleEntity = userSchoolDataIdentifierController.findUserSchoolDataIdentifierRole(sessionController.getLoggedUser());
        if (roleEntity != null) {
          loggedUserRoleArchetype = roleEntity.getArchetype();
        }

        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {        	
          if (!loggedUserRoleArchetype.equals(EnvironmentRoleArchetype.STUDENT)) {
            loggedUserName = String.format("%s %s (%s)", user.getFirstName(), user.getLastName(),
                resolveLoggedUserRoleText());
          }
          else if (user.getNickName() != null) {
            loggedUserName = String.format("%s %s (%s)", user.getNickName(), user.getLastName(),
                user.getStudyProgrammeName());
          }
          else {
            loggedUserName = user.getDisplayName();
          }
          hasFees = user.getHasEvaluationFees();
        }
      }

      this.loggedUserId = sessionController.getLoggedUserEntity().getId();
      this.loggedUser = sessionController.getLoggedUser().toId();
    }
  }

  public boolean getLoggedIn() {
    return sessionController.isLoggedIn();
  }
  
  public String getLoggedUserRoleArchetype() {
    return loggedUserRoleArchetype == null ? null : loggedUserRoleArchetype.toString();
  }

  public boolean getIsActiveUser() {
    return currentUserSession.isActive();
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

  public boolean hasEnvironmentPermission(String permissions) {
    if (StringUtils.isBlank(permissions)) {
      return false;
    }

    for (String permission : StringUtils.split(permissions, ',')) {
      if (sessionController.hasEnvironmentPermission(permission)) {
        return true;
      }
    }

    return false;
  }

  public String getLoggedUserName() {
    return loggedUserName != null ? loggedUserName : "";
  }

  public Locale getLocale() {
    return localeController.resolveLocale(sessionController.getLocale());
  }

  public boolean getHasFees() {
    return hasFees;
  }

  private String resolveLoggedUserRoleText() {
    Locale locale = localeController.resolveLocale(sessionController.getLocale());
    switch (loggedUserRoleArchetype) {
    case ADMINISTRATOR:
      return localeController.getText(locale, "role.administrator");
    case MANAGER:
      return localeController.getText(locale, "role.manager");
    case STUDENT:
      return localeController.getText(locale, "role.student");
    case STUDY_PROGRAMME_LEADER:
      return localeController.getText(locale, "role.studyProgrammeLeader");
    case TEACHER:
      return localeController.getText(locale, "role.teacher");
    case STUDY_GUIDER:
      return localeController.getText(locale, "role.studyguider");
    default:
      return localeController.getText(locale, "role.custom");
    }
  }

  private String loggedUser;
  private Long loggedUserId;
  private EnvironmentRoleArchetype loggedUserRoleArchetype;
  private String loggedUserName;
  private boolean hasFees;
 
}