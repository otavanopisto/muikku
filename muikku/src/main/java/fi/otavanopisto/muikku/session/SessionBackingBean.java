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
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.users.UserController;

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
  private CurrentUserSession currentUserSession;

  @PostConstruct
  @TransactionAttribute(TransactionAttributeType.REQUIRES_NEW)
  public void init() {
    loggedUserId = null;
    loggedUser = null;

    if (sessionController.isLoggedIn()) {
      UserEntity loggedUser = sessionController.getLoggedUserEntity();
      if (loggedUser != null) {
        String activeSchoolDataSource = sessionController.getLoggedUserSchoolDataSource();
        String activeUserIdentifier = sessionController.getLoggedUserIdentifier();
        
        User user = userController.findUserByDataSourceAndIdentifier(activeSchoolDataSource, activeUserIdentifier);
        if (user != null) {        	
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

  public Locale getLocale() {
    return localeController.resolveLocale(sessionController.getLocale());
  }

  public boolean getHasFees() {
    return hasFees;
  }

  private String loggedUser;
  private Long loggedUserId;
  private boolean hasFees;

}