package fi.otavanopisto.muikku.auth;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.event.Event;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.LocaleUtils;
import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.auth.AuthenticationResult.ConflictReason;
import fi.otavanopisto.muikku.auth.AuthenticationResult.Status;
import fi.otavanopisto.muikku.events.LoginEvent;
import fi.otavanopisto.muikku.model.base.SchoolDataSource;
import fi.otavanopisto.muikku.model.security.AuthSource;
import fi.otavanopisto.muikku.model.security.AuthSourceSetting;
import fi.otavanopisto.muikku.model.security.UserIdentification;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.users.UserSchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataController;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.local.LocalSession;
import fi.otavanopisto.muikku.session.local.LocalSessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserSchoolDataIdentifierController;

public abstract class AbstractAuthenticationStrategy implements AuthenticationProvider {

  @Inject
  private Logger logger;
  
  @Inject
  @LocalSession
  private LocalSessionController sessionController;

  @Inject
  private AuthSourceController authSourceController;

  @Inject
  private UserIdentificationController userIdentificationController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private SchoolDataController schoolDataController;

  @Inject
  private UserSchoolDataController userSchoolDataController;
  
  @Inject
  private UserSchoolDataIdentifierController userSchoolDataIdentifierController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  private Event<LoginEvent> userLoggedInEvent;

  protected String getFirstRequestParameter(Map<String, String[]> requestParameters, String key) {
    String[] value = requestParameters.get(key);
    if (value != null && value.length == 1) {
      return value[0];
    }

    return null;
  }

  protected String getAuthSourceSetting(AuthSource authSource, String key) {
    AuthSourceSetting authSourceSetting = authSourceController.findAuthSourceSettingsByKey(authSource, key);
    if (authSourceSetting != null) {
      return authSourceSetting.getValue();
    }

    return null;
  }

  protected AuthenticationResult processLogin(AuthSource authSource, Map<String, String[]> requestParameters, String externalId, List<String> emails, String firstName, String lastName) {
    if ((emails == null) || (emails.isEmpty())) {
      return new AuthenticationResult(Status.NO_EMAIL);
    }
    
    List<UserEntity> emailUsers = userEntityController.listUserEntitiesByEmails(emails);
    if (emailUsers.size() > 1) {
      return new AuthenticationResult(Status.CONFLICT, ConflictReason.SEVERAL_USERS_BY_EMAILS);
    }

    UserEntity emailUser = emailUsers.size() == 1 ? emailUsers.get(0) : null;
    boolean newAccount = false;
    User activeUser = null;

    UserIdentification userIdentification = userIdentificationController.findUserIdentificationByAuthSourceAndExternalId(authSource, externalId);
    if (userIdentification != null) {
      // User has identified by this auth source before
      if (emailUser != null && !emailUser.getId().equals(userIdentification.getUser().getId())) {
        return new AuthenticationResult(Status.CONFLICT, ConflictReason.EMAIL_BELONGS_TO_ANOTHER_USER);
      }
    } else {
      // User has not used this auth source before
      if (emailUser != null) {
        // But has existing user in the system, so we attach the identification into the same user
        userIdentification = userIdentificationController.createUserIdentification(emailUser, authSource, externalId);
      } else {
 
        List<User> users = null;
        
        // If user can be found from datasources by emails, we just attach those users to new entity
        schoolDataBridgeSessionController.startSystemSession();
        try {
          users = userSchoolDataController.listUsersByEmails(emails);
        } finally {
          schoolDataBridgeSessionController.endSystemSession();
        }
        
        UserEntity userEntity = null;
        for (User user : users) {
          UserSchoolDataIdentifier userSchoolDataIdentifier = userSchoolDataIdentifierController.findUserSchoolDataIdentifierByDataSourceAndIdentifier(
              user.getSchoolDataSource(), user.getIdentifier());
          if (userSchoolDataIdentifier != null) {
            if (userEntity == null) {
              userEntity = userSchoolDataIdentifier.getUserEntity();
            }
            else if (!userEntity.getId().equals(userSchoolDataIdentifier.getUserEntity().getId())) {
              logger.severe(String.format("User %s.%s points to multiple UserEntity instances", user.getSchoolDataSource(), user.getIdentifier()));
              return new AuthenticationResult(Status.CONFLICT, ConflictReason.SEVERAL_USERS_BY_EMAILS);
            }
          }
        }
        
        if (userEntity == null) {
          logger.severe(String.format("Unable to resolve UserEntity for %s", StringUtils.join(emails, ',')));
          return new AuthenticationResult(Status.NO_EMAIL);
        }
        
        userIdentification = userIdentificationController.createUserIdentification(userEntity, authSource, externalId);
        newAccount = true;
      }
    }
    
    if (activeUser == null) {    
      activeUser = userSchoolDataController.findActiveUser(userIdentification.getUser().getDefaultSchoolDataSource(), userIdentification.getUser().getDefaultIdentifier());
      if (activeUser == null) {
        activeUser = userSchoolDataController.listUsersByEmails(emails).get(0);
      }
    }
    
    if (activeUser == null) {
      logger.severe(String.format("Active user could not be found"));
      return new AuthenticationResult(AuthenticationResult.Status.ERROR);
    }

    List<String> existingAddresses = userEmailEntityController.listAddressesByUserEntity(userIdentification.getUser());
    for (String email : emails) {
      if (!existingAddresses.contains(email)) {
        userEmailEntityController.addUserEmail(userIdentification.getUser(), email);
      }
    }

    return login(userIdentification, activeUser, newAccount);
  }

  private AuthenticationResult login(UserIdentification userIdentification, User user, boolean newAccount) {
    UserEntity userEntity = userIdentification.getUser();
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    
    if ((loggedUser == null) || loggedUser.getId().equals(userEntity.getId())) {
      Locale locale = null;
      if (StringUtils.isNotBlank(userEntity.getLocale())) {
        try {
          locale = LocaleUtils.toLocale(userEntity.getLocale());
        } catch (Exception e) {
          logger.log(Level.SEVERE, String.format("Failed to parse locale %s for user entity %d", loggedUser.getLocale(), loggedUser.getId()));
        }
      }

      if (locale != null) {
        sessionController.setLocale(locale);
      }

      SchoolDataSource schoolDataSource = schoolDataController.findSchoolDataSource(user.getSchoolDataSource());
      userEntityController.updateDefaultSchoolDataSource(userEntity, schoolDataSource);
      userEntityController.updateDefaultIdentifier(userEntity, user.getIdentifier());
      sessionController.login(schoolDataSource.getIdentifier(), user.getIdentifier());
      userEntityController.updateLastLogin(userEntity);
      HttpServletRequest req = (HttpServletRequest) FacesContext.getCurrentInstance().getExternalContext().getRequest();
      userLoggedInEvent.fire(new LoginEvent(userEntity.getId(), sessionController.getLoggedUser(), this, req.getRemoteAddr()));
      return new AuthenticationResult(newAccount ? Status.NEW_ACCOUNT : Status.LOGIN);
    } else {
      return new AuthenticationResult(Status.CONFLICT, ConflictReason.LOGGED_IN_AS_DIFFERENT_USER);
    }
  }


}