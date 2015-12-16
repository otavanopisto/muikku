package fi.muikku.auth;

import java.util.List;
import java.util.Map;

import javax.enterprise.event.Event;
import javax.faces.context.FacesContext;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;

import fi.muikku.auth.AuthenticationResult.ConflictReason;
import fi.muikku.auth.AuthenticationResult.Status;
import fi.muikku.events.LoginEvent;
import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.security.AuthSource;
import fi.muikku.model.security.AuthSourceSetting;
import fi.muikku.model.security.UserIdentification;
import fi.muikku.model.users.UserEntity;
import fi.muikku.users.UserSchoolDataIdentifierController;
import fi.muikku.users.UserEmailEntityController;
import fi.muikku.users.UserEntityController;
import fi.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.muikku.schooldata.SchoolDataController;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.schooldata.entity.User;
import fi.muikku.session.local.LocalSession;
import fi.muikku.session.local.LocalSessionController;

public abstract class AbstractAuthenticationStrategy implements AuthenticationProvider {

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

  protected AuthenticationResult processLogin(AuthSource authSource, Map<String, String[]> requestParameters, String externalId, List<String> emails, String firstName, String lastName) throws AuthenticationHandleException {
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
        // New user account        
        UserEntity userEntity = userEntityController.createUserEntity((SchoolDataSource) null, null);

        List<User> users = null;
        
        // If user can be found from datasources by emails, we just attach those users to new entity
        schoolDataBridgeSessionController.startSystemSession();
        try {
          users = userSchoolDataController.listUsersByEmails(emails);
        } finally {
          schoolDataBridgeSessionController.endSystemSession();
        }

        if (!users.isEmpty()) {
          for (User user : users) {
            userSchoolDataIdentifierController.createUserSchoolDataIdentifier(user.getSchoolDataSource(), user.getIdentifier(), userEntity);
          }
          
          // Your guess for default identity is the first of returned users.
          activeUser = users.get(0);
        } else {
          // If user could not be found from any of the sources we create new and attach those 
          for (SchoolDataSource schoolDataSource : schoolDataController.listSchoolDataSources()) {
            User user = userSchoolDataController.createUser(schoolDataSource, firstName, lastName);
            if (user != null && activeUser == null) {
              activeUser = user;
            }
          }
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
      throw new AuthenticationHandleException("Active user could not be found");
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